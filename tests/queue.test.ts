import { TimedRetryQueueOptions, TimedRetryQueueTask } from '../src/index'
import { TimedRetryQueue, TimedRetryQueueTasks } from '../src/index'

describe( 'Options test', () => {
	it( 'Create constructor and parse options', async () => {
        const options: TimedRetryQueueOptions = {
            default_retries: 8
        } 
        const executer = new TimedRetryQueue( options )
        const parsedOptions = executer.getOptions()
        expect( parsedOptions.default_retries ).toBe( 8 )
    } )
})

describe( 'Task test', () => {
    it( 'Create timed task that fails', async () => {
        const queue = new TimedRetryQueueTasks()
        const task: TimedRetryQueueTask = {
            task: ( arg1: string, arg2: string, arg3: string ) => {
                throw Error
            },
            args: [ "foo", "bar", "foobar" ],
            parameters: {
                retries: 2,
                interval: "1s"
            }
        }
        queue.add( task )

        const executer = new TimedRetryQueue()
        const process = await executer.process( queue )

        expect( process.length ).toBe( 1 )
        const result = process[ 0 ]

        expect( result ).toBe( undefined )
    } )
    it( 'Create timed task that suceeds', async () => {
        const queue = new TimedRetryQueueTasks()
        queue.add( {
            task: () => {
                return 'Success'
            }
        } )

        const executer = new TimedRetryQueue()
        const process = await executer.process( queue )

        expect( process.length ).toBe( 1 )
        const result = process[ 0 ]

        expect( result ).toBe( 'Success' )
    } )  
	it( 'Execution order test', async () => {
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
