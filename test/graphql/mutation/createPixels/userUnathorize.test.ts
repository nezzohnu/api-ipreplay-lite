// import "../../../support/hooks"
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

//   describe("user unathorize", () => {
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
