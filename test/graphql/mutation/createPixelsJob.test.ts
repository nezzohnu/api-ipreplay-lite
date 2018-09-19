import "../../support/hooks"
import { repeat } from "ramda"
import { v4 as uuid } from 'uuid'
declare const expect, it, describe, before, factory, execGraphql, after
const action = "createPixelsJob"
const deleteMutation = `
mutation deleteSessions($input: DeleteSessionsInput!){
	deleteSessions(input:$input){
		value
	}
}
`
const mutation = `
mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      namespace
      lastKey
      logStreamName
    }
  }
`

const getPixels = repeat({
    event: "event1",
    typeEvent: "tracking",
    level: "info",
    payload: JSON.stringify({
        payload1: '{ z: 1 }',
    }),
    timing: JSON.stringify({ hello: "world" }),
})

describe(__filename, () => {

    describe('valid params given', () => {

        describe('user is guest', () => {
            let user
            let res
            // let sessionId = uuid()
            const prefix = new Date().toJSON().split('T')[0].replace(/\-/g, "/")
            const timestamp = `${new Date().getTime()}`

            before(async () => {
                user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: getPixels(1),
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }
                res = await execGraphql({ query: mutation, variableValues, user })

            })

            after(async () => {
                let user = await factory.create("user")
                await execGraphql({
                    query: deleteMutation, variableValues: {
                        input: { logStreamNames: [res.data.createPixelsJob.logStreamName] }
                    }, user
                })
            })

            it(`should return valid response`, async () => {
                const attr = {
                    namespace: user.namespace
                }
                expect(res.data[action]).to.containSubset(attr)
            })
        })

    })

})
