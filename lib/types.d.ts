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
    extra?: TimedRetryQueueExtraParameters;
};
export declare enum TaskStatus {
    FAIL = "FAIL",
    SUCCESS = "SUCCESS"
}
export interface ITimedRetryQueueTasks {
    add(task: TimedRetryQueueTask): void;
    addMany(tasks: Array<TimedRetryQueueTask>): void;
    isEmpty(): boolean;
    getNextTask(): TimedRetryQueueTask | undefined;
    empty(): void;
    size(): number;
}
export interface TimedRetryQueueStorage {
    [key: number]: TimedRetryQueueTask;
}
export interface TimedRetryQueueExtraParameters {
    [key: string]: any;
}
