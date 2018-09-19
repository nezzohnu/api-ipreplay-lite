import "../../../support/hooks"
import * as data from '../../../config/sessions.data'
declare const expect, it, describe, before, factory, execGraphql, after

const action = "metricsLatency"
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

const query = `query metricsLatency($input: MetricsInput){
	metricsLatency(input: $input){
		data{
			total
			data{
				name
				duration
			}
			label
			id
		}
		collections
		lastKey
	}
}`


describe(__filename, async () => {
    let pixelsJob
    before(async () => {
        let user = await factory.create("user")
        let variableValues = {
            input: {
                pixels: data.resources,
                meta: { state: "init", timestamp: +new Date() }
            }
        }

        pixelsJob = await execGraphql({ query: mutation, variableValues, user })
        await delay(1000)
    })

    after(async () => {
        let user = await factory.create("user")
        await execGraphql({
            query: deleteMutation, variableValues: {
                input: { logStreamNames: [pixelsJob.data.createPixelsJob.logStreamName] }
            }, user
        })
    })

    describe('query metricLatency', () => {

        describe('create resource pixels', async () => {
            let res


            before(async () => {

                let user = await factory.create("user")

                res = await execGraphql({ query, user })

            })

            it(`should return collection length`, async () => {
                expect(res.data[action]).to.have.property('collections').eql('2')
            })

            it(`should return All Host array item`, async () => {
                expect(res.data[action].data[0]).to.have.property('label').eql('All Hosts')
                expect(res.data[action].data[0]).to.have.property('data').length.above(0)
            })

            it(`should return All Files array item`, async () => {
                expect(res.data[action].data[1]).to.have.property('label').eql('All Files')
                expect(res.data[action].data[1]).to.have.property('data').length.above(0)
            })

        })
    })

    describe('query metricLatency unauthorized', () => {

        describe('failure', async () => {
            const startTime = +new Date() - 1000 * 60 * 60
            let res
            before(async () => {
                res = await execGraphql({ query, variableValues: { startTime } })
            })

            it(`should return error`, async () => {
                expect(res.errors[0]).to.have.property('message').eql('token should exist')
            })

        })
    })

})
