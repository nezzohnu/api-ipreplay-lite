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

describe(__filename, () => {

  // describe('valid params given', () => {

  //   describe('user is admin', () => {
  //     let user
  //     let pixel
  //     let res

  //     beforeEach(async () => {
  //       user = await factory.create("user")
  //       pixel = await factory.create("pixel", { namespace: user.namespace })

  //       res = await execGraphql({ query, user })
  //     })

  //     it("should valid result", async () => {
  //       expect(res.data[action].pixels.length).to.eql(1)
  //       expect(res.data[action].pixels).to.containSubset([{ id: pixel.id }])
  //     })
  //   })

  //   describe('user is root', () => {
  //     let user
  //     let pixel
  //     let res

  //     beforeEach(async () => {
  //       user = await factory.create("user")
  //       pixel = await factory.create("pixel")

  //       res = await execGraphql({ query, user })
  //     })

  //     it("should valid result", async () => {
  //       expect(res.data[action].pixels.length).to.eql(1)
  //       expect(res.data[action].pixels).to.containSubset([{ id: pixel.id }])
  //     })
  //   })

  // })

  // describe('empty params given', () => {

  //   describe('user is admin', () => {
  //     let user
  //     let pixel
  //     let res

  //     beforeEach(async () => {
  //       user = await factory.create("user")
  //       pixel = await factory.create("pixel")

  //       res = await execGraphql({ query, user })
  //     })

  //     it("should valid result", async () => {
  //       expect(res.data[action].pixels).to.eql([])
  //     })
  //   })

  // })

  describe("unauthorized", () => {
    let res

    beforeEach(async () => {
      res = await execGraphql({ query, unauth: true })
    })

    it('should return valid response', async () => {
      expect(res.errors[0]).to.have.property("message")
    })
  })

})
