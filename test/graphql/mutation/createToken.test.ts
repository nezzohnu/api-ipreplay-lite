import "../../support/hooks"

const password = "password"
const query = `
  mutation createToken($input: CreateTokenInput!) {
    createToken(input: $input) {
      token
      namespace
    }
  }
`

describe(__filename, () => {

  describe(`valid params given`, async () => {
    let user
    let res

    beforeEach(async () => {
      user = await factory.create('user', { password })

      const variableValues = {
        input: {
          email: user.email,
          password: password,
        }
      }

      res = await execGraphql({ query, variableValues, unauth: true })
    })

    it(`should return token`, async () => {
      expect(res.data.createToken).to.have.property("token")
    })

    it(`should return namespace`, async () => {
      expect(res.data.createToken).to.have.property("namespace")
    })
  })

  describe(`empty params given`, async () => {
    it("should return error", async () => {
      const variableValues = {
        input: {
          email: "test@test.com",
          password: "test",
        }
      }

      const res = await execGraphql({ query, variableValues, unauth: true })

      expect(res.errors[0]).to.have.property('message').eql("user not found")
    })
  })

  describe(`wrong password`, async () => {
    it("should return error", async () => {
      let password = "SFXQlXYh5vbISyb"
      let user = await factory.create('user', { password })

      const variableValues = {
        input: {
          email: user.email,
          password: "wrong password",
        }
      }

      const res = await execGraphql({ query, variableValues, unauth: true })

      expect(res.errors[0]).to.have.property('message').eql("wrong password")
    })
  })

})
