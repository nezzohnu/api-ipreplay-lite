import "../../../support/hooks"
import * as data from '../../../config/sessions.data'

const deleteMutation = `
mutation deleteSessions($input: DeleteSessionsInput!){
	deleteSessions(input:$input){
		value
	}
}
`

declare const expect, it, describe, before, after, factory, execGraphql

const action = "metricsOs"
const mutation = `
mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      namespace
      lastKey
      logStreamName
    }
  }
`

const query = `query {		
	metricsOs{
		data{
			total
			streamsSearched
			id
			label
			data{
				payload
				video{currentTime videoId duration}
				logStreamName
			}
		}
		collections
		lastKey
	}
}`

describe(__filename, async () => {
    let logStreamNames = []
    let res
    before(async () => {
        let user = await factory.create("user")
        let pixel1 = await execGraphql({
            query: mutation, variableValues: {
                input: { pixels: data.session_os_browser, meta: { state: "init", timestamp: +new Date() } }
            }, user
        })

        logStreamNames = [
            pixel1.data.createPixelsJob.logStreamName
        ]
        await delay(1000)
        const startTime = +new Date() - 1000 * 60 * 60
        res = await execGraphql({ query, variableValues: { startTime }, user })
    })

    after(async () => {
        let user = await factory.create("user")
        await execGraphql({
            query: deleteMutation, variableValues: {
                input: { logStreamNames: logStreamNames }
            }, user
        })
    })
    describe('query metricsOs', async () => {


        it(`should return data`, async () => {
            expect(res.data[action].data[0]).to.have.property('data').length.above(0)
        })

        it(`should return property total`, async () => {
            expect(res.data[action].data[0]).to.have.property('total')
        })

        it(`should return property os`, async () => {
            const os = JSON.parse(res.data[action].data[0].total)
            expect(os['Mac OS,10.13.6']).above(0)
        })
    })

})


