import "../../support/hooks"

declare const expect, it, describe, beforeEach, factory, matchers, execGraphql

const action = "createToken"
const query = `
mutation createToken($input: CreateTokenInput!) {
    createToken(input: $input) {
      publicKey
      token
      namespace
    }
  }
`
describe(__filename, () => {
  describe('login', () => {

    describe('login success', async () => {
      let res
      let user

      beforeEach(async () => {
        user = await factory.create("user", { password: "T35tpassword!" })

        const variableValues = {
          input: {
            email: user.email,
            password: "T35tpassword!",
          }
        }
        res = await execGraphql({ query, variableValues })
      })

      it(`should return token`, async () => {
        expect(res.data[action]).to.have.property('token')
      })

      it(`should return namespace`, async () => {
        expect(res.data[action]).to.have.property('namespace').eql('urn:ipreplay:' + user.id)
      })

      it(`should return publickey`, async () => {
        expect(res.data[action]).to.have.property('publicKey')
      })
    })

    describe('login failure: invalid password', async () => {
      let res
      let user

      beforeEach(async () => {
        user = await factory.create("user", { password: "T35tpassword!" })

        const variableValues = {
          input: {
            email: user.email,
            password: "T35tpassword",
          }
        }
        res = await execGraphql({ query, variableValues })
      })

      it(`should return error`, async () => {
        expect(res.errors[0]).to.have.property('message').eql("invalid user or password")
      })
    })

    describe('login failure: invalid user', async () => {
      let res
      let user

      beforeEach(async () => {
        user = await factory.create("user", { password: "T35tpassword!" })

        const variableValues = {
          input: {
            email: "trst@gmal.com",
            password: "T35tpassword!",
          }
        }
        res = await execGraphql({ query, variableValues })
      })

      it(`should return error`, async () => {
        expect(res.errors[0]).to.have.property('message').eql("invalid user or password")
      })
    })
  })
})