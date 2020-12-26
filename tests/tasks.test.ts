import { TimedRetryQueueTasks, TimedRetryQueueStorage } from '../src/index'

describe( 'TimedRetryQueue adding', () => {
	it( 'Add task', () => {
		const queue = new TimedRetryQueueTasks()
		queue.add( {
			task: () => {
				console.log( 'SUCCESS!' )
				return true
			}
		} )
		expect( queue.size() ).toEqual( 1 )
	} )
	it( 'Add multiple tasks', () => {
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
		expect( queue.size() ).toEqual( 2 )
	} )
} )

describe( 'TimedRetryQueue getting', () => {
	it( 'Process next', () => {
		const queue = new TimedRetryQueueTasks()
		queue.add( {
			task: () => {
				console.log( 'SUCCESS!' )
				return true
			}
		} )
		queue.getNextTask()
		expect( queue.size() ).toEqual( 0 )
	} )
	it( 'Process next when empty', () => {
		const queue = new TimedRetryQueueTasks()
		const next = queue.getNextTask()
		expect( next ).toBe( undefined )
		expect( queue.size() ).toEqual( 0 )
	} )
} )

describe( 'TimedRetryQueue delete test', () => {
	it( 'Delete all', () => {
		const queue = new TimedRetryQueueTasks()
		queue.add( {
			task: () => {
				console.log( 'SUCCESS!' )
				return true
			}
		} )
		queue.empty()
		const next = queue.getNextTask()
		expect( next ).toBe( undefined )
		expect( queue.size() ).toEqual( 0 )
	} )
} )

describe( 'TimedRetryQueue empty test', () => {
	it( 'Is empty', () => {
		const queue = new TimedRetryQueueTasks()
		expect( queue.isEmpty() ).toBe( true )
	} )
	it( 'Is not empty', () => {
		const queue = new TimedRetryQueueTasks()
		queue.add( {
			task: () => {
				return true
			}
		} )
		expect( queue.isEmpty() ).toBe( false )
	} )
} )