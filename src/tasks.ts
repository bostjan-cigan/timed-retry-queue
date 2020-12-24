import {
    TimedRetryQueueTask,
    ITimedRetryQueueTasks,
    TimedRetryQueueStorage
} from './index'

class TimedRetryQueueTasks implements ITimedRetryQueueTasks {
    private queue: TimedRetryQueueStorage = {}
    private queueSize: number = 0
    private current: number = 1

    constructor() {}

    public add( task: TimedRetryQueueTask ): void {
        const size = ++this.queueSize
        this.queue[ size ] = task
    }

    public addMany( tasks: Array<TimedRetryQueueTask> ): void {
        tasks.forEach( ( task ) => {
            this.add( task )
        } )
    }

    public isEmpty(): boolean {
        return this.queueSize === 0
    }

    public getNext(): TimedRetryQueueTask | undefined {
        if ( this.queueSize > 0 ) {
            const task = this.queue[ this.current ]
            delete this.queue[ this.current ]
            this.queueSize--
            ++this.current
            return task
        }

    }

    public empty(): void {
        for ( let property in this.queue ) {
            delete this.queue[ property ]
        }
        this.queueSize = 0
        this.current = 1
    }

    public size(): number {
        return this.queueSize
    }
}

export default TimedRetryQueueTasks