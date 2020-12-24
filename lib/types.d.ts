export declare type TimedRetryQueueOptions = {
    default_retries?: number;
};
export declare type TimedRetryQueueTask = {
    task: Function;
    args?: Array<any>;
    parameters?: TimedRetryQueueTaskParameters;
};
export declare type TimedRetryQueueTaskParameters = {
    retries?: number;
    interval?: String;
};
export declare enum TaskStatus {
    FAIL = "FAIL",
    SUCCESS = "SUCCESS"
}
export interface ITimedRetryQueueTasks {
    add(task: TimedRetryQueueTask): void;
    addMany(tasks: Array<TimedRetryQueueTask>): void;
    isEmpty(): boolean;
    getNext(): TimedRetryQueueTask | undefined;
    empty(): void;
    size(): number;
}
export interface TimedRetryQueueStorage {
    [key: number]: TimedRetryQueueTask;
}