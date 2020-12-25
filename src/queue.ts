import timestring from 'timestring'

import {
	TimedRetryQueueTask,
	TaskStatus,
	TimedRetryQueueOptions,
	ITimedRetryQueueTasks
} from './types'

class TimedRetryQueue {
	private default_retries: number = 1

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
				let tries = this.default_retries
				if ( task.parameters?.retries ) {
					tries = task.parameters.retries
				}
				const result = await this.executeTask( task, tries, true )
				processResults.push( result )		
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
			default_retries: this.default_retries
		}
	}

	/**
	 * Parse options that are passed in.
	 *
	 * @param options
	 */
	private parseOptions( options: TimedRetryQueueOptions ): void {
		if ( options.default_retries ) {
			this.default_retries = options.default_retries
		}
	}

	/**
	 * Tries to execute task within a timeout limit.
	 *
	 * @param task	  			  Task that will be executed.
	 * @param firstExecution	  Boolean if task is executed for the first time.
	 */
	private async executeTry( task: TimedRetryQueueTask, firstExecution: boolean ): Promise<any> {
		const args = task.args || []
		let interval: number = 0
	
		if ( task.parameters?.interval && ! firstExecution ) {
			interval = timestring( task.parameters.interval, 'ms' )
		}

		return new Promise( ( resolve, reject ) => {
			setTimeout( async () => {
				try {
					const result = await task.task.call( this, ...args )
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
	 * @param task	Task that will be executed.
	 * @param limit Limited number of times of execution (fails).
	 */
	private async executeTask( task: TimedRetryQueueTask, limit: number, first: boolean = false ): Promise<void> {
		if ( limit > 0 ) {
			const result = await this.executeTry( task, first ).catch( e => e )
			if ( result == TaskStatus.FAIL ) {
				return await this.executeTask( task, limit - 1 )
			}
			return result
		}
	}
}

export default TimedRetryQueue