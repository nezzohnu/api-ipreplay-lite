import "./support/hooks"
import { filter } from 'ramda'
import * as data from './config/sessions.data'
import { getEnvVars } from "../serverless_config.js"
declare const expect, it, describe, before, factory, execGraphql, after, delay

const action = "metricsBrowser"
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
	metricsBrowser{
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

describe(__filename, function async() {
    describe('query metricsBrowser', async () => {
        let res
        let pixelsJob
        let user
        before(async () => {
            const startTime = +new Date() - 1000 * 60 * 60
            user = await factory.create("user")
            let variableValues = {
                input: {
                    pixels: data.session_os_browser,
                    meta: { state: "init", timestamp: +new Date() }
                }
            }
            pixelsJob = await execGraphql({ query: mutation, variableValues, user })

            await delay()
            res = await execGraphql({ query, user })
        })

        after(async () => {
            let user = await factory.create("user")
            await execGraphql({
                query: deleteMutation, variableValues: {
                    input: { logStreamNames: [pixelsJob.data.createPixelsJob.logStreamName] }
                }, user
            })
        })

        it(`should return data`, async () => {
            expect(res.data[action].data[0]).to.have.property('data').length.above(0)
        })

        it(`should return property total`, async () => {
            expect(res.data[action].data[0]).to.have.property('total')
        })

        it(`should increment Chrome count`, async () => {
            const os = JSON.parse(res.data[action].data[0].total)
            expect(os['Chrome,68.0.3440.106']).above(0)
        })
    })

})

