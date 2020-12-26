import { TimedRetryQueueOptions, TimedRetryQueueTask } from '../src/index'
import { TimedRetryQueue, TimedRetryQueueTasks } from '../src/index'

describe( 'Options test', () => {
	it( 'Parse options', async () => {
		const options: TimedRetryQueueOptions = {
			defaultRetries: 8,
			passCurrentResults: true,
			default_retries: 8
		} 
		const executer = new TimedRetryQueue( options )
		const parsedOptions = executer.getOptions()
		expect( parsedOptions.defaultRetries ).toBe( 8 )
		expect( parsedOptions.passCurrentResults ).toBe( true )
	} )
} )

describe( 'Task execution test', () => {
	it( 'Number of retries', async() => {
		const queue = new TimedRetryQueueTasks()
		const task: TimedRetryQueueTask = {
			task: jest.fn( ( arg1, arg2, arg3 ) => undefined ),
			args: [ "foo", "bar", "foobar" ],
			parameters: {
				retries: 2,
				interval: "1s"
			}
		}
		queue.add( task )

		const executer = new TimedRetryQueue()
		const process = await executer.process( queue )

		expect( task.task ).toBeCalledTimes( 1 )
		expect( task.task ).toBeCalledWith( "foo", "bar", "foobar" )
		
		expect( process.length ).toBe( 1 )
		const result = process[ 0 ]

		expect( result ).toBe( undefined )
	} )
	it( 'Order of execution', async () => {
		const queue = new TimedRetryQueueTasks()
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
		const executer = new TimedRetryQueue()
		const process = await executer.process( queue )

		expect( process[ 0 ] ).toEqual( true )
		expect( process[ 1 ] ).toEqual( false )
	} )
} )

describe( 'API test', () => {
	it( 'onTaskStart()', async() => {
		const queue = new TimedRetryQueueTasks()
		const task: TimedRetryQueueTask = {
			task: jest.fn( _ => { throw Error } ),
			args: [ "foo", "bar", "foobar" ],
			parameters: {
				retries: 2,
				interval: "1s",
				onTaskStart: jest.fn( ( processResults ) => undefined )
			}
		}
		queue.add( task )

		const executer = new TimedRetryQueue()
		const process = await executer.process( queue )

		expect( task.parameters?.onTaskStart ).toBeCalledWith( [] )
		expect( task.parameters?.onTaskStart ).toBeCalledTimes( 1 )
	} )
	it( 'onTaskComplete()', async() => {
		const queue = new TimedRetryQueueTasks()
		const task: TimedRetryQueueTask = {
			task: jest.fn( _ => { throw Error } ),
			args: [ "foo", "bar", "foobar" ],
			parameters: {
				retries: 2,
				interval: "1s",
				onTaskComplete: jest.fn( ( result, processResults ) => undefined )
			}
		}
		queue.add( task )

		const executer = new TimedRetryQueue()
		const process = await executer.process( queue )

		expect( task.parameters?.onTaskComplete ).toBeCalledTimes( 1 )
		expect( task.parameters?.onTaskComplete ).toBeCalledWith( undefined, [ undefined ] )        
	} )
	it( 'onTryStart()', async() => {
		const queue = new TimedRetryQueueTasks()
		const task: TimedRetryQueueTask = {
			task: jest.fn( _ => { throw Error } ),
			args: [ "foo", "bar", "foobar" ],
			parameters: {
				retries: 2,
				interval: "1s",
				onTryStart: jest.fn( _ => undefined )
			}
		}
		queue.add( task )

		const executer = new TimedRetryQueue()
		const process = await executer.process( queue )

		expect( task.parameters?.onTryStart ).toBeCalledTimes( 2 )        
	} )
	it( 'onTryComplete()', async() => {
		const queue = new TimedRetryQueueTasks()
		const task: TimedRetryQueueTask = {
			task: jest.fn( _ => { throw Error } ),
			args: [ "foo", "bar", "foobar" ],
			parameters: {
				retries: 3,
				interval: "1s",
				onTryComplete: jest.fn( _ => undefined )
			}
		}
		queue.add( task )

		const executer = new TimedRetryQueue()
		const process = await executer.process( queue )

		expect( task.parameters?.onTryComplete ).toBeCalledTimes( 3 )        
	} )
} )

describe( 'Passing results test', () => {
	it( 'Provided in options', async() => {
		const queue = new TimedRetryQueueTasks()
		const taskOne: TimedRetryQueueTask = {
			task: jest.fn( ( arg1, results ) => {
				throw Error
			} ),
			args: [ "foo" ],
			parameters: {
				retries: 2,
				interval: "1s"
			}
		}
		queue.add( taskOne )

		const taskTwo = {
			task: jest.fn( ( arg1, results ) => true ),
			args: [ "foo" ],
			parameters: {
				retries: 2
			}
		}
		queue.add( taskTwo )

		const executer = new TimedRetryQueue( {
			passCurrentResults: true
		} )
		const process = await executer.process( queue )

		expect( taskOne.task ).toHaveBeenLastCalledWith( "foo", [] )
		expect( taskTwo.task ).toHaveBeenCalledWith( "foo", [ undefined ] )
	} )
	it( 'Provided in task', async() => {
		const queue = new TimedRetryQueueTasks()
		const taskOne: TimedRetryQueueTask = {
			task: jest.fn( ( arg1 ) => {
				throw Error
			} ),
			args: [ "foo" ],
			parameters: {
				retries: 2,
				interval: "1s"
			}
		}
		queue.add( taskOne )

		const taskTwo = {
			task: jest.fn( ( arg1, results ) => true ),
			args: [ "foo" ],
			parameters: {
				retries: 2,
				passCurrentResults: true
			}
		}
		queue.add( taskTwo )

		const taskThree = {
			task: jest.fn( ( arg1, results ) => true ),
			args: [],
			parameters: {
				passResultFromPrevious: true
			}
		}
		queue.add( taskThree )

		const taskFour = {
			task: jest.fn( ( arg1, results ) => true ),
			args: [],
			parameters: {
				passResultFromPrevious: true,
				passCurrentResults: true
			}
		}
		queue.add( taskFour )

		const executer = new TimedRetryQueue()
		const process = await executer.process( queue )

		expect( taskOne.task ).toHaveBeenLastCalledWith( "foo" )
		expect( taskTwo.task ).toHaveBeenCalledWith( "foo", [ undefined ] )
		expect( taskThree.task ).toHaveBeenCalledWith( true )
		expect( taskFour.task ).toHaveBeenCalledWith( true, [ undefined, true, true ] )
	} )
} )