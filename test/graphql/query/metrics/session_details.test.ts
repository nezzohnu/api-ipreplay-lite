import "../../../support/hooks"
import { sessions as data } from '../../../config/sessions.data'


const deleteMutation = `
mutation deleteSessions($input: DeleteSessionsInput!){
	deleteSessions(input:$input){
		value
	}
}
`

declare const expect, it, describe, before, after, factory, execGraphql

const mutation = `
mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      namespace
      lastKey
      logStreamName
    }
  }
`

const query = `query getSessionPixels($limit: String = "1000", $logStreamName: String!, $lastKey: String, $offset: String){
	pixels(input:{limit:$limit,logStreamName:$logStreamName, lastKey:$lastKey, offset:$offset}){
		pixels{
			logStreamName
			event 
			typeEvent 
			level 
			payload 
			createdAt
			timing{duration startTime entryType name}
			video{currentTime duration videoId}
			state 
			
			}
		total
		lastKey
		namespace
	}
}
`


describe(__filename, async () => {

    describe('query session details', () => {
        let logStreamNames = []

        before(async () => {
            let user = await factory.create("user")
            let variableValues = {
                input: {
                    pixels: data,
                    meta: { state: "init", timestamp: +new Date() }
                }
            }

            let pixel1 = await execGraphql({ query: mutation, variableValues, user })

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

        describe('create resource pixels', async () => {
            let user
            let res
            before(async () => {
                user = await factory.create("user")

                res = await execGraphql({ query, variableValues: { logStreamName: logStreamNames[0] }, user })

            })

            it(`should return collection length = ${data.length.toString()}`, async () => {
                expect(res.data.pixels).to.have.property('total').eql(data.length.toString())
            })

        })
    })

})


