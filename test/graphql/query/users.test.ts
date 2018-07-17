import "../../support/hooks"

const action = "users"
const query = `
  query {
    users {
      users {
        ${matchers.userAttr}
      }
      namespace
      total
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
        userFind = await factory.create("userGuest")

        const variableValues = {
          input: {
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
          }
        }

        res = await execGraphql({ query, variableValues, user })
      })

      it("should return error", async () => {
        expect(res.errors[0]).to.have.property('message').eql("Authorization error")
      })
    })
  })

})
