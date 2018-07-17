import "../../support/hooks"
import * as sinon from 'sinon'
// import * as sendEmail from "app/services/emails/send"
import { User } from "app/models"

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
  let mockSend

  // beforeEach(() => {
  //   mockSend = sinon.stub(sendEmail, 'default').returns(sinon.spy())
  // })

  // afterEach(() => {
  //   mockSend.restore()
  // })

  describe('valid params given', () => {

    describe('without user', () => {
      let res
      let recipient
      let user
      let newUser

      beforeEach(async () => {
        newUser = await factory.build("user")

        const variableValues = {
          input: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
          }
        }

        res = await execGraphql({ query, variableValues, unauth: true })
      })

      it(`should return valid response`, async () => {
        const attr = {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        }

        expect(res.data[action].user).to.containSubset(attr)
      })

      it(`should have property meta`, async () => {
        expect(res.data[action]).to.have.property("namespace")
      })

      // it("should called send email", async () => {
      //   expect(mockSend.called).to.eql(true)
      // })

    })

  })

  describe('wrong params given', () => {

    describe('without user', () => {
      let res
      let recipient
      let newUser
      let user

      beforeEach(async () => {
        user = await factory.create("user")

        newUser = await factory.build("user", { email: user.email })

        const variableValues = {
          input: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
          }
        }

        res = await execGraphql({ query, variableValues, unauth: true })
      })

      it(`should return wrong message`, async () => {
        expect(res.errors[0]).to.have.property("message").eql("email already exist")
      })

      it(`should return valid response`, async () => {
        const users = await User.find()

        expect(users.count).to.eql(1)
      })

    })

  })

})
