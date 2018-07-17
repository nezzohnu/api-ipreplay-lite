import "../../../support/hooks"

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

//     describe('user is root', () => {
//       let user
//       let pixel1
//       let pixel2
//       let res

//       beforeEach(async () => {
//         user = await factory.create("user")
//         pixel1 = await factory.create("pixel", { id: "1" })
//         pixel2 = await factory.create("pixel", { id: "2" })

//         const variableValues = {
//           input: {
//             offset: "1"
//           }
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it("should valid length", async () => {
//         expect(res.data[action].pixels.length).to.eql(1)
//       })
//     })

//   })

// })
