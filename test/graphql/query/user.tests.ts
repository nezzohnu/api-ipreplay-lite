import "../../support/hooks"

const action = "user"
const query = `
  query($input: IdInput!) {
    user(input: $input) {
      user {
        ${matchers.userAttr}
      }
      namespace
    }
  }
`

describe(__filename, () => {

  describe('wrong params given', () => {

    describe('user is admin', () => {
      let user
      let userFind
      let res

      beforeEach(async () => {
        user = await factory.create("user")
        userFind = await factory.create("user")

        const variableValues = {
          input: {
            id: userFind.id,
          }
        }

        res = await execGraphql({ query, variableValues, user })
      })

      it("should return error", async () => {
        expect(res.errors[0]).to.have.property('message').eql("Authorization error")
      })
    })

    describe('user is guest', () => {
      let user
      let userFind
      let res

      beforeEach(async () => {
        user = await factory.create("userGuest")
        userFind = await factory.create("user")

        const variableValues = {
          input: {
            id: userFind.id,
          }
        }

        res = await execGraphql({ query, variableValues, user })
      })

      it("should return userFind", async () => {
        expect(res.errors[0]).to.have.property('message').eql("Authorization error")
      })
    })

  })

  describe("user unathorize", () => {
    let res

    beforeEach(async () => {
      let user = await factory.create('user')

      const variableValues = {
        input: {
          id: user.id
        }
      }

      res = await execGraphql({ query, variableValues, unauth: true })
    })

    it("should return error", async () => {
      expect(res).to.have.property('errors')
    })
  })

})
