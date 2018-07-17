import "../support/hooks"
import { graphqlHandler } from "../../src/lambda-services/handler"
import { createJwt } from "../../src/app/services/jwt"
import * as sinon from "sinon"

// describe(__filename, () => {

//   describe("create log", () => {
//     let user
//     let event

//     beforeEach(async () => {
//       user = await factory.create("user")

//       const jwt = createJwt(user)

//       event = {
//         name: "updatePasswordMe",
//         type: "Mutation",
//         args: {
//           oldPassword: "123",
//           newPassword: "12345",
//         },
//         headers: {
//           authorization: `Bearer ${jwt}`,
//         },
//       }

//       const context = sinon.spy()
//       const callback = sinon.spy()

//       await graphqlHandler(event, context, callback)
//     })

//     it('should return result', async () => {
//       // const log = await Log.findOne()

//       const attr = {
//         user: user.id,
//         relay: "OnErrors",
//         level: "error",
//       }

//       // expect(log).to.containSubset(attr)
//     })
//   })

// })
