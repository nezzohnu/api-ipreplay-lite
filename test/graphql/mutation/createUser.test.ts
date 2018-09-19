import "../../support/hooks"
import * as sinon from 'sinon'
// import * as sendEmail from "app/services/emails/send"
import { User } from "app/models"

declare const expect, it, describe, beforeEach, factory, matchers, execGraphql

const action = "createUser"
const query = `
mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        ${matchers.userAttr}
      }
      namespace
    }
  }
`
describe(__filename, () => {
  describe('create user', () => {

    describe('new user', async () => {
      let res
      let user

      beforeEach(async () => {
        user = await factory.create("user")

        const variableValues = {
          input: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: "test@gmail.com",
            password: user.password,
          }
        }
        res = await execGraphql({ query, variableValues })
      })

      it(`should return new user`, async () => {
        expect(res.data.createUser.user.email).to.eql("test@gmail.com")
      })
      it(`should return valid response`, async () => {
        const attr = {
          firstName: user.firstName,
          lastName: user.lastName,
        }

        expect(res.data[action].user).to.containSubset(attr)
      })
      it(`should have property meta`, async () => {
        expect(res.data[action]).to.have.property("namespace")
      })
    })

    describe('duplicate email', async () => {
      let res
      let newUser
      let user

      beforeEach(async () => {
        user = await factory.create("user")

        newUser = await factory.build("user", { email: user.email })

        const variableValues = {
          input: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: newUser.email,
            password: user.password,
          }
        }
        res = await execGraphql({ query, variableValues })
      })

      it(`should return error`, async () => {
        expect(res.errors[0]).to.have.property('message').eql("email already exist")
      })
    })
  })
})