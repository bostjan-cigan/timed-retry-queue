import { TimedRetryQueueOptions, ITimedRetryQueueTasks } from './types';
declare class TimedRetryQueue {
    private default_retries;
    constructor(options?: TimedRetryQueueOptions);
    /**
     * Process queue.
     */
    process(queue: ITimedRetryQueueTasks): Promise<Array<any>>;
    /**
     * Fetch options of TimedQueue.
     */
    getOptions(): TimedRetryQueueOptions;
    /**
     * Parse options that are passed in.
     *
     * @param options
     */
    private parseOptions;
    /**
     * Tries to execute task within a timeout limit.
     *
     * @param task	  			  Task that will be executed.
     * @param firstExecution	  Boolean if task is executed for the first time.
     */
    private executeTry;
    /**
     * Executes task retryer.
     *
     * @param task	Task that will be executed.
     * @param limit Limited number of times of execution (fails).
     */
    private executeTask;
}
export default TimedRetryQueue;
