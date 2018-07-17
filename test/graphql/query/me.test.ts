import "../../support/hooks"

const query = `
  query {
    me {
      ${matchers.userAttr}
    }
  }
`

describe(__filename, () => {
  let user, res

  describe('valid params given', () => {
    beforeEach(async () => {
      user = await factory.create("user")
      res = await execGraphql({ query, user })
    })

    it("should have user", async () => {
      expect(res.data.me).to.containSubset({ id: user.id })
    })
  })

  describe("user unathorized", () => {
    beforeEach(async () => {
      user = await factory.create("user")
      res = await execGraphql({ query, unauth: true })
    })

    it("should have error", async () => {
      expect(res.errors[0]).to.have.property("message")
    })
  })

})
