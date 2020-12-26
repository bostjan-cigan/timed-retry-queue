import { TimedRetryQueueOptions, ITimedRetryQueueTasks } from './types';
declare class TimedRetryQueue {
    private defaultRetries;
    private passCurrentResults;
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
     * Get task arguments.
     *
     * @param task				Task to be executed.
     * @param processResults 	Current queue results.
     */
    private getTaskArguments;
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
     * @param taskArgs	  		  The task arguments.
     */
    private executeTry;
    /**
     * Executes task retryer.
     *
     * @param task			 Task that will be executed.
     * @param limit 		 Limited number of times of execution (fails).
     * @param taskArgs 		 Current task arguments.
     * @param first			 Is it the first execution (used for setTimeout).
     */
    private executeTask;
}
export default TimedRetryQueue;
