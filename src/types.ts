export type TimedRetryQueueOptions = {
	default_retries?: number
}

export type TimedRetryQueueTask = {
	task: Function,
	args?: Array<any>,
	parameters?: TimedRetryQueueTaskParameters
}

export type TimedRetryQueueTaskParameters = {
	retries?: number,
	interval?: String
}

export enum TaskStatus {
	FAIL = 'FAIL',
	SUCCESS = 'SUCCESS'
}

export interface ITimedRetryQueueTasks {
	add( task: TimedRetryQueueTask ): void,
	addMany( tasks: Array<TimedRetryQueueTask> ): void
	isEmpty(): boolean
	getNext(): TimedRetryQueueTask | undefined
	empty(): void,
	size(): number
}

export interface TimedRetryQueueStorage {
	[key: number]: TimedRetryQueueTask
}