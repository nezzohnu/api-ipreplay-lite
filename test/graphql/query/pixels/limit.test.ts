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
//         pixel1 = await factory.create("pixel")
//         pixel2 = await factory.create("pixel")

//         const variableValues = {
//           input: {
//             limit: 1
//           }
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it("should valid result", async () => {
//         expect(res.data[action].pixels.length).to.eql(1)
//       })

//     })

//     describe('user is root', () => {
//       let user
//       let res

//       beforeEach(async () => {
//         user = await factory.create("user")

//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")
//         await factory.create("pixel")

//         const variableValues = {
//           input: {
//           }
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it("should valid status", async () => {
//         expect(res.data[action].pixels.length).to.eql(10)
//       })

//     })

//   })

// })
