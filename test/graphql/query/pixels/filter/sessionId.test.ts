import "../../../../support/hooks"

const action = "pixels"
const query = `
  query($input: PixelsInput) {
    pixels(input: $input) {
      pixels {
        ${matchers.pixelAttr}
      }
      namespace
      total
      lastKey
    }
  }
`

// describe(__filename, () => {

//   describe('valid params given', () => {

//     describe('user is admin', () => {
//       let user
//       let pixel
//       let res

//       beforeEach(async () => {
//         user = await factory.create("userAdmin")
//         pixel = await factory.create("pixel", { namespace: user.namespace })

//         const variableValues = {
//           input: {
//             sessionId: pixel.sessionId,
//           }
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it("should valid result", async () => {
//         expect(res.data[action].pixels.length).to.eql(1)
//         expect(res.data[action].pixels).to.containSubset([{ id: pixel.id }])
//       })
//     })

//   })

//   describe('empty params given', () => {

//     describe('user is admin', () => {
//       let user
//       let pixel
//       let res

//       beforeEach(async () => {
//         user = await factory.create("userAdmin")
//         pixel = await factory.create("pixel", { namespace: user.namespace })

//         const variableValues = {
//           input: {
//             sessionId: "sessionId",
//           }
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it("should valid result", async () => {
//         expect(res.data[action].pixels).to.eql([])
//       })
//     })

//   })

// })
