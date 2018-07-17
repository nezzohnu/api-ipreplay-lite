import "../../support/hooks"
import { repeat } from "ramda"
import { v4 as uuid } from 'uuid'

const action = "createPixelsJob"
const query = `
  mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      value
      lastKey
      namespace
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
            let sessionId = uuid()
            const prefix = new Date().toJSON().split('T')[0].replace(/\-/g, "/")
            const timestamp = `${new Date().getTime()}`

            beforeEach(async () => {
                user = await factory.create("userGuest")

                const input = {
                    pixels: getPixels(1),
                    meta: {
                        state: "state",
                        sessionId: sessionId,
                        timestamp,
                    },
                }

                res = await graphqlHandler(query, input, user.publicKey)

            })

            it(`should return valid response`, async () => {
                const attr = {
                    value: "pixels send in a background job",
                    namespace: user.namespace,
                    logStreamName: prefix + '/' + sessionId
                }

                expect(res.data[action]).to.containSubset(attr)
            })
        })

    })

})
