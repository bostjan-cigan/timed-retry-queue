[![Timed Retry Queue](assets/logo.png "Timed Retry Queue")](https://bostjan-cigan.com "Boštjan Cigan")
------------

# Timed Retry Queue

[![npm version](https://badge.fury.io/js/%40kijuub%2Ftimed-retry-queue.svg)](https://badge.fury.io/js/%40kijuub%2Ftimed-retry-queue) 
![Coverage](badges/coverage.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an easy utility for processing tasks in a sequential order with a number of retries (time based) before failing or returning the result.

It can also be used as a regular queue if you do not provide retry information or reset the default settings.

The default queue implementation is FIFO based.

You can also use the following extension(s) to change how the queue behaves or write your own queue implementation.

* [Timed Retry Dependency Queue](https://npmjs.com/@kijuub/timed-retry-dependency-queue) - A dependency queue implementation where tasks are executed in the order of their specified dependencies

## Getting started

First install the package.

```bash
yarn add @kijuub/timed-retry-queue
npm install @kijuub/timed-retry-queue
```

## Usage

By default the queue tasks are processed in FIFO order.

First you need to create the `TimedRetryQueue` object. There are some optional parameters that you can override while creating the constructor:

```javascript
import { TimedRetryQueue } from '@kijuub/timed-retry-queue'

const options: TimedRetryQueueOptions = {
    defaultRetries: 8,
    passCurrentResults: true
} 
const executer = new TimedRetryQueue( options )
```

The parameter `defaultRetries` overrides the default number of retries for a failed task that does not have the retries options specified. By default this is set to 1.

The parameter `passCurrentResults` is `false` by default. With this the current queue results get passed to the next function that needs to be executed (following the arguments).

### Adding tasks

To add tasks to the process method, you need to create the `TimedRetryQueueTasks` object. You can add both retry tasks or tasks that do not need to be retried.

```javascript
import { TimedRetryQueue, TimedRetryQueueTasks } from '@kijuub/timed-retry-queue'

const executer = new TimedRetryQueue()

const queue = new TimedRetryQueueTasks()

queue.add( {
    task: ( arg1 ) => {
        console.log( `The first argument is: ${ arg1 }` )
        return true
    },
    args: [ "Just pass me in!" ],
    parameters: {
    	retries: 2,
    	interval: "2s"
    }
} )

queue.addMany(
    [
        {
            task: () => {
                return true
            }
        },
        {
            task: () => {
                return false
            }
        }
    ]
)

const process = await executer.process( queue )
```

The `process` method on the `executer` accepts the queue and processes the queue and returns the results in an array.

When adding a task the following options are supported:

```javascript
{
	"task": <function>,
	"args": <array>,
	"parameters": {
		"retries": <number>,
		"interval": <string>,
		"passCurrentResults": <boolean>,
		"passResultFromPrevious": <boolean>,
		"onTryStart": <function>,
		"onTryComplete": <function>,
		"onTaskStart": <function>,
		"onTaskComplete": <function>,
		"extra": <object>
	}
}
```

The `task` parameter is the function that needs to be executed, the `arguments` parameters are the arguments that are used for the function call.

The `parameters` object allows you to define task options. All parameters are optional.

#### Regular options

> retries

Number of retries that are done if task fails.

> interval

What is the interval between retries (specified using timestring e.g. 1s, 1 minute, 1m etc.).

> passCurrentResults

When calling tasks, if this is set to `true` then the last argument passed to your function call will be the current queue results.

```javascript
// ...
const task = {
	task: ( arg1, results ) => {
		// The arg1 will contains "foo"
		// resultFromPrevious contains the result of the previous task
	},
	parameters: {
		passCurrentResults: true,
		args: [ "foo" ]
	}
}
```

**NOTE:** If you use both options `passCurrentResults` and `passResultFromPrevious` the result from the previous function is returned first and then the results of the whole queue.

> passResultFromPrevious

When calling the current task, if this is set to `true` then the last argument passed to your function call will be the previous task result.

```javascript
// ...
const task = {
	task: ( arg1, resultFromPrevious ) => {
		// The arg1 will contains "foo"
		// resultFromPrevious contains the result of the previous task
	},
	parameters: {
		passResultFromPrevious: true,
		args: [ "foo" ]
	}
}
```

**NOTE:** If you use both options `passCurrentResults` and `passResultFromPrevious` the result from the previous function is returned first and then the results of the whole queue.

> extra

An object that is a custom key value store (the key is string based). This is mainly used for custom queue implementations.

#### Task API

> onTryStart

Before the try of a task starts this function will be called.

```javascript
// ...
const task = {
	task: () => true,
	parameters: {
		onTryStart: () => {
			// Execute your logic here
		}
	}
}
```

> onTryComplete

When a try of a task is complete this function gets called.

```javascript
// ...
const task = {
	task: () => true,
	parameters: {
		onTryComplete: () => {
			// Execute your logic here
		}
	}
}
```

> onTaskStart

A callback function that gets triggered before task gets started, it passes in the current queue results.

```javascript
// ...
const task = {
	task: () => true,
	parameters: {
		onTaskStart: ( results: Array<any> ) => {
			// The results variable contains the current results of the tasks that were already executed
		}
	}
}
```

> onTaskComplete

When the task gets completed this function will be called. The passed in arguments are the result of the task and the current queue results.

```javascript
// ...
const task = {
	task: () => true,
	parameters: {
		onTaskComplete: ( result: any, results: Array<any> ) => {
			// The result variable contains the result of the current task
			// The results variable contains the current results of the tasks that were already executed
		}
	}
}
```

**NOTE:** The task is deemed failed if an error is thrown.

The `TimedRetryQueueTasks` also supports the following methods:

```javascript
add( task: TimedRetryQueueTask ): void,
addMany( tasks: Array<TimedRetryQueueTask> ): void
isEmpty(): boolean
getNextTask(): TimedRetryQueueTask | undefined
empty(): void,
size(): number
```

They respectively:

* Add a single task
* Add multiple tasks
* Check if the process queue is empty
* Fetch the next task
* Empty the task queue
* Return the current size of the task queue

### Custom queue

By default the queue is processed in a FIFO order. If you would like to implement it differently you can implement your own `TimedRetryQueueTasks` class by implementing the exported `ITimedRetryQueueTasks` interface.

```javascript
interface ITimedRetryQueueTasks {
	add( task: TimedRetryQueueTask ): void,
	addMany( tasks: Array<TimedRetryQueueTask> ): void
	isEmpty(): boolean
	getNextTask(): TimedRetryQueueTask | undefined
	empty(): void,
	size(): number
}
```

When implementing custom queues you have the ability to add extra parameters to the `TimedRetryQueueTask`. The parameter for that is `extra` which is a key (string) value store.

## Contributions

If you would like to make any contribution you are welcome to do so.
