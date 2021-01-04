import timestring from 'timestring'

import {
	TimedRetryQueueTask,
	TaskStatus,
	TimedRetryQueueOptions,
	ITimedRetryQueueTasks
} from './types'

class TimedRetryQueue {
	private defaultRetries: number = 1
	private passCurrentResults = false

	constructor( options: TimedRetryQueueOptions = {} ) {
		this.parseOptions( options )
	}

	/**
	 * Process queue.
	 */
	public async process( queue: ITimedRetryQueueTasks ): Promise<Array<any>> {
		const processResults: Array<any> = []
		let runExecutionLoop: boolean = true

		while( runExecutionLoop ) {
			const task: TimedRetryQueueTask | undefined = queue.getNextTask()
			if ( task ) {
				let tries = this.defaultRetries
				if ( task.parameters?.retries ) {
					if ( task.parameters.retries === -1 ) {
						tries = Number.MAX_SAFE_INTEGER
					} else {
						tries = task.parameters.retries
					}
				}

				if ( task.parameters?.onTaskStart ) {
					await task.parameters.onTaskStart.call( this, [ ...processResults ] )
				}
				const taskArgs = this.getTaskArguments( task, processResults )
				const result = await this.executeTask( task, tries, taskArgs, true )
				processResults.push( result )	
				if ( task.parameters?.onTaskComplete ) {
					await task.parameters.onTaskComplete.call( this, result, [ ...processResults ] )
				}
			} else {
				runExecutionLoop = false
				queue.empty()
			}
		}
		return processResults
	}

	/**
	 * Fetch options of TimedQueue.
	 */
	public getOptions(): TimedRetryQueueOptions {
		return {
			defaultRetries: this.defaultRetries,
			passCurrentResults: this.passCurrentResults
		}
	}

	/**
	 * Get task arguments.
	 * 
	 * @param task				Task to be executed. 
	 * @param processResults 	Current queue results.
	 */
	private getTaskArguments( task: TimedRetryQueueTask, processResults: Array<any> ): Array<any> {
		const args = []

		if ( task.args ) {
			args.push( ...task.args )
		}

		if ( task.parameters?.passResultFromPrevious && processResults.length > 0 ) {
			args.push( processResults[ processResults.length - 1 ] )
		}

		if ( this.passCurrentResults || task.parameters?.passCurrentResults ) {
			args.push( [ ...processResults ] )
		}

		return args
	}

	/**
	 * Parse options that are passed in.
	 *
	 * @param options
	 */
	private parseOptions( options: TimedRetryQueueOptions ): void {
		if ( options.defaultRetries ) {
			this.defaultRetries = options.defaultRetries
		}
		if ( options.passCurrentResults ) {
			this.passCurrentResults = options.passCurrentResults
		}
		if ( options.default_retries ) {
			console.warn( `WARNING: Option default_retries will be deprecated in next minor version. Please use defaultRetries instead.` )
			this.defaultRetries = options.default_retries
		}
	}

	/**
	 * Tries to execute task within a timeout limit.
	 *
	 * @param task	  			  Task that will be executed.
	 * @param firstExecution	  Boolean if task is executed for the first time.
	 * @param taskArgs	  		  The task arguments.
	 */
	private async executeTry( task: TimedRetryQueueTask, firstExecution: boolean, taskArgs: Array<any> ): Promise<any> {
		let interval: number = 0

		if ( task.parameters?.interval && ! firstExecution ) {
			interval = timestring( task.parameters.interval, 'ms' )
		}

		return new Promise( ( resolve, reject ) => {
			setTimeout( async () => {
				try {
					const result = await task.task.call( this, ...taskArgs )
					resolve( result )
				} catch ( err ) {
					reject( TaskStatus.FAIL )
				}
			}, interval )
		})
	}

	/**
	 * Executes task retryer.
	 *
	 * @param task			 Task that will be executed.
	 * @param limit 		 Limited number of times of execution (fails).
	 * @param taskArgs 		 Current task arguments.
	 * @param first			 Is it the first execution (used for setTimeout).
	 */
	private async executeTask( task: TimedRetryQueueTask, limit: number, taskArgs: Array<any>, first: boolean = false ): Promise<void> {
		if ( limit > 0 ) {
			if ( task.parameters?.onTryStart ) {
				task.parameters.onTryStart.call( this )
			}
			const result = await this.executeTry( task, first, taskArgs ).catch( e => e )
			if ( task.parameters?.onTryComplete ) {
				const taskSuccess = result === TaskStatus.FAIL ? false : true
				task.parameters.onTryComplete.call( this, taskSuccess )
			}
			if ( result == TaskStatus.FAIL ) {
				return await this.executeTask( task, limit - 1, taskArgs )
			}
			return result
		}
	}
}

export default TimedRetryQueue