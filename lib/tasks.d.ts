import { TimedRetryQueueTask, ITimedRetryQueueTasks } from './index';
declare class TimedRetryQueueTasks implements ITimedRetryQueueTasks {
    private queue;
    private queueSize;
    private current;
    constructor();
    add(task: TimedRetryQueueTask): void;
    addMany(tasks: Array<TimedRetryQueueTask>): void;
    isEmpty(): boolean;
    getNext(): TimedRetryQueueTask | undefined;
    empty(): void;
    size(): number;
}
export default TimedRetryQueueTasks;
