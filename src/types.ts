export type TimedRetryQueueOptions = {
	defaultRetries?: number,
	passCurrentResults?: boolean,
	/**
	 * @deprecated Use defaultRetries instead.
	 */
	default_retries?: number
}

export type TimedRetryQueueTask = {
	task: Function,
	args?: Array<any>,
	parameters?: TimedRetryQueueTaskParameters
}

export type TimedRetryQueueTaskParameters = {
	retries?: number,
	interval?: String,
	passCurrentResults?: boolean,
	passResultFromPrevious?: boolean,
	onTryStart?: Function,
	onTryComplete?: Function,
	onTaskStart?: Function,
	onTaskComplete?: Function,
	extra?: TimedRetryQueueExtraParameters
}

export enum TaskStatus {
	FAIL = 'FAIL',
	SUCCESS = 'SUCCESS'
}

export interface ITimedRetryQueueTasks {
	add( task: TimedRetryQueueTask ): void,
	addMany( tasks: Array<TimedRetryQueueTask> ): void
	isEmpty(): boolean
	getNextTask(): TimedRetryQueueTask | undefined
	empty(): void,
	size(): number
}

export interface TimedRetryQueueStorage {
	[ key: number ]: TimedRetryQueueTask
}

export interface TimedRetryQueueExtraParameters {
	[ key: string ]: any
}