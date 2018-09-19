import "../../support/hooks"
import * as sinon from 'sinon'
import Pixel from "app/models/pixel"

declare const expect, it, describe, beforeEach, factory, matchers, execGraphql

const action = "createPixelsJob"
const deleteMutation = `
mutation deleteSessions($input: DeleteSessionsInput!){
	deleteSessions(input:$input){
		value
	}
}
`
const query = `
mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      namespace
      lastKey
      logStreamName
    }
  }
`
describe(__filename, () => {
    describe('pixels', async () => {

        describe('create multiple pixels', async () => {
            let res
            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            },
                            {
                                event: "nx:end",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            }
                        ],
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }
                res = await execGraphql({ query, variableValues, user })
            })
            after(async () => {
                let user = await factory.create("user")
                await execGraphql({
                    query: deleteMutation, variableValues: {
                        input: { logStreamNames: [res.data.createPixelsJob.logStreamName] }
                    }, user
                })
            })

            it(`should return logStreamName`, async () => {
                expect(res.data[action]).to.have.property('logStreamName')
            })

            it(`should return lastKey`, async () => {
                expect(res.data[action]).to.have.property('lastKey')
            })

            it(`should return namespace`, async () => {
                expect(res.data[action]).to.have.property('namespace')
            })
        })

        describe('append pixels to existing logStream', async () => {
            let res
            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            },
                            {
                                event: "nx:end",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            }
                        ],
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }
                res = await execGraphql({ query, variableValues, user })

                variableValues.input['logStreamName'] = res.data[action].logStreamName
                variableValues.input['lastKey'] = res.data[action].lastKey

                res = await execGraphql({ query, variableValues, user })
            })

            after(async () => {
                let user = await factory.create("user")
                await execGraphql({
                    query: deleteMutation, variableValues: {
                        input: { logStreamNames: [res.data.createPixelsJob.logStreamName] }
                    }, user
                })
            })

            it(`should return logStreamName`, async () => {
                expect(res.data[action]).to.have.property('logStreamName')
            })

            it(`should return lastKey`, async () => {
                expect(res.data[action]).to.have.property('lastKey')
            })

            it(`should return namespace`, async () => {
                expect(res.data[action]).to.have.property('namespace')
            })
        })

        describe('create single pixel', async () => {
            let res
            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            }
                        ],
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }
                res = await execGraphql({ query, variableValues, user })
            })

            after(async () => {
                let user = await factory.create("user")
                await execGraphql({
                    query: deleteMutation, variableValues: {
                        input: { logStreamNames: [res.data.createPixelsJob.logStreamName] }
                    }, user
                })
            })

            it(`should return logStreamName`, async () => {
                expect(res.data[action]).to.have.property('logStreamName')
            })

            it(`should return lastKey`, async () => {
                expect(res.data[action]).to.have.property('lastKey')
            })

            it(`should return namespace`, async () => {
                expect(res.data[action]).to.have.property('namespace')
            })
        })

        describe('invalid pixel property', async () => {
            let res

            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                invalidProp: "invalidValue",
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            }
                        ],
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }

                res = await execGraphql({ query, variableValues, user })
            })

            it(`should return error`, async () => {
                expect(res).to.have.property('errors')
            })

        })

        describe('invalid meta property', async () => {
            let res

            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            }
                        ],
                        meta: { invalidProp: "invalidValue", state: "init", timestamp: +new Date() }
                    }
                }

                res = await execGraphql({ query, variableValues, user })
            })


            it(`should return error`, async () => {
                expect(res).to.have.property('errors')
            })

        })

        describe('invalid payload format', async () => {
            let res

            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{timing:{name:nx:begin,entryType:mark,startTime:4459.89999989979,duration:0}}",
                                video: "{\"hi\":\"hello\"}"
                            }
                        ],
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }

                res = await execGraphql({ query, variableValues, user })
            })


            it(`should return error`, async () => {
                expect(res.errors[0]).to.have.property('message').eql('payload, timing, and video value should be valid json as string')
            })
        })

        describe('invalid timing format', async () => {
            let res

            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{hello:world}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{\"hi\":\"hello\"}"
                            }
                        ],
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }

                res = await execGraphql({ query, variableValues, user })
            })

            it(`should return error`, async () => {
                expect(res.errors[0]).to.have.property('message').eql('payload, timing, and video value should be valid json as string')
            })
        })

        describe('invalid video format', async () => {
            let res

            before(async () => {
                let user = await factory.create("user")
                let variableValues = {
                    input: {
                        pixels: [
                            {
                                event: "nx:begin",
                                level: "info",
                                typeEvent: "tracking",
                                timing: "{\"hello\":\"world\"}",
                                payload: "{\"timing\":{\"name\":\"nx:begin\",\"entryType\":\"mark\",\"startTime\":4459.89999989979,\"duration\":0}}",
                                video: "{hi:hello}"
                            }
                        ],
                        meta: { state: "init", timestamp: +new Date() }
                    }
                }

                res = await execGraphql({ query, variableValues, user })
            })

            it(`should return error`, async () => {
                expect(res.errors[0]).to.have.property('message').eql('payload, timing, and video value should be valid json as string')
            })
        })
    })
})