import "../../../../support/hooks"
import { addDays } from "app/services/utils"

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

const oldDay = addDays(new Date(), -60).getTime()
const beforeDay = addDays(new Date(), -40).getTime()
const nowDay = new Date().getTime()
const futureDay = addDays(new Date(), 40).getTime()

// describe(__filename, () => {

//   describe('valid params given', () => {

//     describe('user is admin', () => {
//       let user
//       let pixel
//       let res

//       beforeEach(async () => {
//         user = await factory.create("user")
//         pixel = await factory.create("pixel", { timestamp: beforeDay, namespace: user.namespace })

//         const variableValues = {
//           input: {
//             timestampEnd: nowDay,
//           }
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it("should return valid result", async () => {
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
//         user = await factory.create("user")
//         pixel = await factory.create("pixel", { timestamp: futureDay, namespace: user.namespace })

//         const variableValues = {
//           input: {
//             timestampEnd: nowDay,
//           }
//         }

//         res = await execGraphql({ query, variableValues, user })
//       })

//       it("should return empty", async () => {
//         expect(res.data[action].pixels).to.eql([])
//       })
//     })

//   })

// })
