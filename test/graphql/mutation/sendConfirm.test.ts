import "../../support/hooks"
import * as sinon from 'sinon'
// import * as sendEmail from "app/services/emails/send"

const query = `
  mutation sendConfirm {
    sendConfirm {
      value
      namespace
    }
  }
`

describe(__filename, () => {

  // describe("valid params given", () => {
  //   let mockSend

  //   beforeEach(() => {
  //     mockSend = sinon.stub(sendEmail, 'default').returns(sinon.spy())
  //   })

  //   afterEach(() => {
  //     mockSend.restore()
  //   })

  //   describe("user is guest", () => {
  //     let user
  //     let res

  //     beforeEach(async () => {
  //       user = await factory.create("userGuest")

  //       res = await execGraphql({ query, user })
  //     })

  //     it("should return valid result", async () => {
  //       expect(res.data.sendConfirm.value).to.eql("ok")
  //     })

  //     it(`should have property meta`, async () => {
  //       expect(res.data.sendConfirm).to.have.property("namespace").eql(user.namespace)
  //     })

  //     it("should called send email", async () => {
  //       expect(mockSend.called).to.eql(true)
  //     })
  //   })

  // })

  // describe("wrong params given", () => {

  //   describe("user guest", () => {
  //     let user
  //     let res

  //     beforeEach(async () => {
  //       user = await factory.create("user")

  //       res = await execGraphql({ query, user })
  //     })

  //     it("should not update company", async () => {
  //       expect(res.errors[0]).to.have.property('message')
  //     })
  //   })

  // })

  // describe("user unauthorized", () => {
  //   let res
  //   let user

  //   beforeEach(async () => {
  //     user = await factory.create("userGuest")

  //     res = await execGraphql({ query, unauth: true })

  //   })

  //   it("should return error", async () => {
  //     expect(res).to.have.property('errors')
  //   })

  // })

})
