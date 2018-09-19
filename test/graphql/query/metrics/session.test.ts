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

const action = "metricsSession"
const mutation = `
mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      namespace
      lastKey
      logStreamName
    }
  }
`

const query = `query metricsSession($input: MetricsInput){		
	metricsSession(input: $input){
		data{
			total
			streamsSearched
			id
			label
			data{
				payload
				video{currentTime videoId videoId}
				logStreamName
			}
		}
		collections
		lastKey
	}
}`


describe(__filename, async () => {
    let res
    let logStreamNames = []

    before(async () => {
        let user = await factory.create("user")
        let pixel1 = await execGraphql({
            query: mutation, variableValues: {
                input: {
                    pixels: data.session_mpc_mra_pla_mep,
                    meta: { state: "init", timestamp: +new Date() }
                }
            }, user
        })

        logStreamNames = [
            pixel1.data.createPixelsJob.logStreamName

        ]
        await delay()
    })

    after(async () => {
        let user = await factory.create("user")
        await execGraphql({
            query: deleteMutation, variableValues: {
                input: { logStreamNames: logStreamNames }
            }, user
        })
    })

    describe('query metricSessions', () => {

        describe('create resource pixels', async () => {
            let user
            let res
            before(async () => {
                const startTime = +new Date() - 1000 * 60 * 60
                user = await factory.create("user")

                res = await execGraphql({ query, variableValues: { startTime }, user })
            })

            it(`should return collection length`, async () => {
                expect(res.data[action]).to.have.property('collections').eql('2')
                expect(res.data[action].data[0]).to.have.property('data').length.above(0)
            })

        })
    })

    describe('query metricSessions unauthorized', () => {

        describe('failure', async () => {

            let res
            before(async () => {
                res = await execGraphql({ query, variableValues: { startTime: +new Date() - 1000 * 60 }, })
            })

            it(`should return error`, async () => {
                expect(res.errors[0]).to.have.property('message').eql('token should exist')
            })

        })
    })

})

