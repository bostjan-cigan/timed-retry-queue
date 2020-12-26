import {
	TimedRetryQueueTask,
	ITimedRetryQueueTasks,
	TimedRetryQueueStorage
} from './index'

class Queue implements ITimedRetryQueueTasks {
	private queue: TimedRetryQueueStorage = {}
	private start: number = -1
	private end: number = -1

	constructor() {}

	public add( task: TimedRetryQueueTask ): void {
		this.enqueue( task )
	}

	public addMany( tasks: Array<TimedRetryQueueTask> ): void {
		tasks.forEach( ( task ) => {
			this.enqueue( task )
		} )
	}

	public isEmpty(): boolean {
		return this.size() === 0
	}

	public getNextTask(): TimedRetryQueueTask | undefined {
		return this.dequeue()
	}

	public empty(): void {
		for ( let property in this.queue ) {
			delete this.queue[ property ]
		}
		this.start = -1
		this.end = -1
	}

	public size(): number {
		return this.end - this.start
	}

	private enqueue( task: TimedRetryQueueTask ): void {
		this.queue[ ++this.end ] = task        
	}

	private dequeue(): TimedRetryQueueTask | undefined {
		if ( this.size() > 0 ) {
			const next = this.queue[ ++this.start ]
			delete this.queue[ this.start ]
			return next
		}
		return undefined
	}

}

export default Queue