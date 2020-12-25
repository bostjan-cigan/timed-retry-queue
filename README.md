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
    default_retries: 8
} 
const executer = new TimedRetryQueue( options )
```

The parameter `default_retries` overrides the default number of retries for a failed task that does not have the retries options specified. By default this is set to 1.

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
		"interval": <string>
	}
}
```

The `task` parameter is the function that needs to be executed, the `arguments` parameters are the arguments that are used for the function call.

The `parameters` object allows you to define how many `retries` to do before failing, the `interval` sets how much time between retries. This options supports timestring based values (e.g. 1s, 2 seconds, 2m etc.).

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
