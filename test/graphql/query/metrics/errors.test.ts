import "../../../support/hooks"
import { filter } from 'ramda'
import * as data from '../../../config/sessions.data'
declare const expect, it, describe, before, factory, after, execGraphql

const action = "metricsError"
const mutation = `
mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      namespace
      lastKey
      logStreamName
    }
  }
`
const deleteMutation = `
mutation deleteSessions($input: DeleteSessionsInput!){
	deleteSessions(input:$input){
		value
	}
}
`
const query = `query {		
	metricsError{
		data{
			total
			streamsSearched
			id
			label
			data{
				payload
				video{currentTime videoId duration}
                logStreamName
                timing{duration entryType name}
			}
		}
		collections
		lastKey
	}
}`

describe(__filename, async () => {

    describe('query metricsError', async () => {
        let logState
        let res

        let pixelsJob

        before(async () => {
            let user = await factory.create("user")
            let startTime = +new Date() - 1000 * 60

            logState = await execGraphql({ query, variableValues: { startTime }, user })

            pixelsJob = await execGraphql({
                query: mutation, variableValues: {
                    input: { pixels: data.session_errors, meta: { state: "init", timestamp: +new Date() } }
                }, user
            })
            await delay()

            res = await execGraphql({ query, variableValues: { startTime }, user })

        })

        after(async () => {
            let user = await factory.create("user")
            await execGraphql({
                query: deleteMutation, variableValues: {
                    input: { logStreamNames: [pixelsJob.data.createPixelsJob.logStreamName] }
                }, user
            })
        })

        it(`should return updated nx:media:error`, async () => {
            const filta = x => x.id === 'nx:media:error'
            const o = filter(filta, logState.data[action].data)
            const n = filter(filta, res.data[action].data)

            expect(parseInt(n.total)).to.eql(parseInt(o.total) + 1)
        })

        it(`should return updated nx:media:console:error`, async () => {
            const filta = x => x.id === 'nx:media:console:error'
            const o = filter(filta, logState.data[action].data)
            const n = filter(filta, res.data[action].data)

            expect(parseInt(n.total)).to.eql(parseInt(o.total) + 1)
        })
    })

})

