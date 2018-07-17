// import "../../support/hooks"
// import * as sinon from 'sinon'
// import Pixel from "app/models/pixel"

// const action = "createPixels"
// const query = `
//   mutation createPixels($input: CreatePixelsInput!) {
//     createPixels(input: $input) {
//       pixels {
//         ${matchers.pixelAttr}
//       }
//       relay
//       namespace
//       total
//       lastKey
//       ${matchers.logRequest}
//     }
//   }
// `

// describe(__filename, () => {

//   describe('valid params given', () => {

//     // describe('check limit count', () => {
//     //   let mock
//     //   let user
//     //   let company
//     //   let campaign
//     //   let recipient
//     //   let res
//     //   const sessionId = "sessionId"
//     //   const timestamp = new Date().getTime()

//     //   // NOTE stub Pixel.isLimitCount
//     //   beforeEach(() => { mock = sinon.stub(Pixel, 'isLimitCount').returns(true) })
//     //   afterEach(() => { mock.restore() })

//     //   beforeEach(async () => {
//     //     user = await factory.create("user")

//     //     await factory.create("pixel", { sessionId })
//     //     await factory.create("pixel", { sessionId })

//     //     const variableValues = {
//     //       input: {
//     //         pixels: [
//     //           {
//     //             event: "event1",
//     //             typeEvent: "event",
//     //             level: "info",
//     //             payload: JSON.stringify({ payload: 'event1' }),
//     //             namespace: "namespace",
//     //           },
//     //         ],
//     //         meta: {
//     //           state: "state",
//     //           sessionId: sessionId,
//     //           timestamp,
//     //         },
//     //       },
//     //     }

//     //     res = await execGraphql({ query, variableValues, user })
//     //   })

//     //   it(`should return wrong result`, async () => {
//     //     expect(res.errors[0]).to.have.property('message').eql("pixels have limit by sessionId")
//     //   })
//     // })

//     describe('user is guest', () => {
//       let user
//       let company
//       let campaign
//       let recipient
//       let res
//       const timestamp = `${new Date().getTime()}`

//       beforeEach(async () => {
//         user = await factory.create("userGuest")

//         const variableValues = {
//           input: {
//             pixels: [
//               {
//                 event: "event1",
//                 typeEvent: "event",
//                 level: "info",
//                 payload: JSON.stringify({ payload: 'event1' }),
//                 namespace: "namespace",
//               },
//               {
//                 typeEvent: "tracking",
//                 event: "event2",
//                 level: "info",
//                 payload: JSON.stringify({ payload: 'event2' }),
//                 namespace: "namespace",
//               },
//             ],
//             meta: {
//               state: "state",
//               sessionId: "sessionId",
//               timestamp,
//             },
//           },
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it(`should return event1`, async () => {
//         const attr = {
//           event: "event1",
//           typeEvent: "event",
//           level: "info",
//           payload: JSON.stringify({ payload: 'event1' }),
//           state: "state",
//           timestamp,
//           sessionId: "sessionId",
//           namespace: user.namespace,
//         }
//         console.log(res.data[action].pixels)
//         expect(res.data[action].pixels).to.containSubset([attr])
//       })

//       it(`should return event2`, async () => {
//         const attr = {
//           typeEvent: "tracking",
//           event: "event2",
//           level: "info",
//           payload: JSON.stringify({ payload: 'event2' }),
//           state: "state",
//           timestamp,
//           sessionId: "sessionId",
//           namespace: user.namespace,
//         }

//         expect(res.data[action].pixels).to.containSubset([attr])
//       })

//       it(`should return total`, async () => {
//         expect(res.data[action].total).to.eql("2")
//       })
//     })

//     // describe('root is guest without namespace', () => {
//     //   let user
//     //   let company
//     //   let campaign
//     //   let recipient
//     //   let res
//     //   const timestamp = `${new Date().getTime()}`

//     //   beforeEach(async () => {
//     //     user = await factory.create("userRoot")

//     //     const variableValues = {
//     //       input: {
//     //         pixels: [
//     //           {
//     //             event: "event1",
//     //             typeEvent: "event",
//     //             level: "info",
//     //             payload: JSON.stringify({ payload: 'event1' }),
//     //             namespace: "namespace",
//     //           },
//     //           {
//     //             typeEvent: "tracking",
//     //             event: "event2",
//     //             level: "info",
//     //             payload: JSON.stringify({ payload: 'event2' }),
//     //           },
//     //         ],
//     //         meta: {
//     //           state: "state",
//     //           sessionId: "sessionId",
//     //           timestamp,
//     //         },
//     //       },
//     //     }

//     //     res = await execGraphql({ query, variableValues, user })
//     //   })

//     //   it(`should return event1`, async () => {
//     //     const attr = {
//     //       event: "event1",
//     //       typeEvent: "event",
//     //       level: "info",
//     //       payload: JSON.stringify({ payload: 'event1' }),
//     //       state: "state",
//     //       timestamp,
//     //       sessionId: "sessionId",
//     //       namespace: "namespace",
//     //     }

//     //     expect(res.data[action].pixels).to.containSubset([attr])
//     //   })

//     //   it(`should return event2`, async () => {
//     //     const attr = {
//     //       typeEvent: "tracking",
//     //       event: "event2",
//     //       level: "info",
//     //       payload: JSON.stringify({ payload: 'event2' }),
//     //       state: "state",
//     //       timestamp,
//     //       sessionId: "sessionId",
//     //       namespace: user.namespace,
//     //     }

//     //     expect(res.data[action].pixels).to.containSubset([attr])
//     //   })

//     //   it(`should return total`, async () => {
//     //     expect(res.data[action].total).to.eql("2")
//     //   })
//     // })


//     // describe('user is root', () => {
//     //   let user
//     //   let company
//     //   let campaign
//     //   let recipient
//     //   let res
//     //   const timestamp = `${new Date().getTime()}`

//     //   beforeEach(async () => {
//     //     user = await factory.create("userRoot")

//     //     const variableValues = {
//     //       input: {
//     //         pixels: [
//     //           {
//     //             event: "event1",
//     //             typeEvent: "event",
//     //             level: "info",
//     //             payload: JSON.stringify({ payload: 'event1' }),
//     //           },
//     //         ],
//     //         meta: {
//     //           state: "state",
//     //           sessionId: "sessionId",
//     //           timestamp,
//     //           namespace: "namespace",
//     //         },
//     //       },
//     //     }

//     //     res = await execGraphql({ query, variableValues, user })
//     //   })

//     //   it(`should return event1`, async () => {
//     //     const attr = {
//     //       event: "event1",
//     //       typeEvent: "event",
//     //       level: "info",
//     //       payload: JSON.stringify({ payload: 'event1' }),
//     //       state: "state",
//     //       timestamp,
//     //       sessionId: "sessionId",
//     //       namespace: "namespace",
//     //     }

//     //     expect(res.data[action].pixels).to.containSubset([attr])
//     //   })

//     //   it(`should return total`, async () => {
//     //     expect(res.data[action].total).to.eql("1")
//     //   })
//     // })

//     // describe('payload', () => {
//     // describe('without payload', () => {
//     //   let user
//     //   let company
//     //   let campaign
//     //   let recipient
//     //   let res
//     //   const timestamp = `${new Date().getTime()}`

//     //   beforeEach(async () => {
//     //     user = await factory.create("userRoot")

//     //     const variableValues = {
//     //       input: {
//     //         pixels: [
//     //           {
//     //             event: "event1",
//     //             typeEvent: "event",
//     //             level: "info",
//     //           },
//     //         ],
//     //         meta: {
//     //           state: "state",
//     //           sessionId: "sessionId",
//     //           timestamp,
//     //           namespace: "namespace",
//     //         },
//     //       },
//     //     }

//     //     res = await execGraphql({ query, variableValues, user })
//     //   })

//     //   it(`should return event1`, async () => {
//     //     const attr = {
//     //       event: "event1",
//     //       typeEvent: "event",
//     //       level: "info",
//     //       state: "state",
//     //       timestamp,
//     //       sessionId: "sessionId",
//     //       namespace: "namespace",
//     //     }

//     //     expect(res.data[action].pixels).to.containSubset([attr])
//     //   })

//     //   it(`should return total`, async () => {
//     //     expect(res.data[action].total).to.eql("1")
//     //   })
//     // })

//     // describe('invalid payload', () => {
//     //   let user
//     //   let company
//     //   let campaign
//     //   let recipient
//     //   let res
//     //   const timestamp = `${new Date().getTime()}`

//     //   beforeEach(async () => {
//     //     user = await factory.create("user")

//     //     const variableValues = {
//     //       input: {
//     //         pixels: [
//     //           {
//     //             event: "event1",
//     //             typeEvent: "event",
//     //             level: "info",
//     //             payload: "{123445}",
//     //           },
//     //         ],
//     //         meta: {
//     //           state: "state",
//     //           sessionId: "sessionId",
//     //           timestamp,
//     //           namespace: "namespace",
//     //         },
//     //       },
//     //     }

//     //     res = await execGraphql({ query, variableValues, user })
//     //   })

//     //   it(`should have error`, async () => {
//     //     expect(res.errors[0]).to.have.property("message").eql("payload should be valid json as string")
//     //   })
//     // })
//     // })

//   })

//   describe('empty params given', () => {
//     let res
//     let user

//     beforeEach(async () => {
//       user = await factory.create("user")

//       const variableValues = {
//         input: {
//         }
//       }

//       res = await execGraphql({ query, variableValues, user })
//     })

//     it("should return empty data", async () => {
//       expect(res.data[action].pixels).to.eql([])
//     })

//     it("should return total as null", async () => {
//       expect(res.data[action].total).to.eql(null)
//     })
//   })

//   describe("user unauthorized", () => {
//     let res
//     let user
//     let company

//     beforeEach(async () => {
//       user = await factory.create("userAdmin")

//       const variableValues = {}

//       res = await execGraphql({ query, variableValues, unauth: true })
//     })

//     it("should return error", async () => {
//       expect(res).to.have.property('errors')
//     })
//   })

// })
