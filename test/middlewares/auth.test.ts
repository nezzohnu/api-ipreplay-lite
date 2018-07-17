import "../support/hooks"
import * as sinon from "sinon"
import AuthMiddleware from 'app/middlewares/auth'
import { createJwt } from "app/services/jwt"

describe(__filename, () => {

  describe('valid token', () => {
    it("should verifyJwt", async () => {
      const user = await factory.create("user")
      const token = createJwt(user)

      let req = { header: () => { return `Authorization ${token}` } }
      let res = { status: () => {} }
      let next = () => {}

      await AuthMiddleware(req, res, next)

      expect(req.payload).to.have.property('user_id').eql(user.id)
    })

    it("should not have payload", async () => {
      const user = await factory.create("user")
      const token = createJwt(user)

      let req = { header: () => { return `Authorization ${token}` } }
      let res = { status: () => {} }
      let next = () => {}

      await AuthMiddleware(req, res, next)

      expect(req.payload).to.not.have.property('email').eql(user.email)
    })
  })

  describe('wrong token', () => {
    let user
    let jwt
    let req
    let res
    let next

    beforeEach(async () => {
      user = await factory.build("user", { id: "12345" })
      jwt = createJwt(user)

      req = { header: () => { return `Authorization ${jwt}` } }
      res = { status: () => {} }
      next = sinon.spy()

      await AuthMiddleware(req, res, next)
    })

    it("user not exist", async () => {
      const error = next.firstCall.args[0].message

      expect(error).to.eql("user not found")
    })

    it("should verifyJwt", async () => {
      let req = { header: () => { return "Authorization test" } }
      let res = { status: () => {} }
      let next = sinon.spy()

      await AuthMiddleware(req, res, next)

      expect(next.calledWithMatch(Error)).to.be.true
    })
  })

  describe('empty token', () => {
    it("should return error", async () => {
      let req = { header: () => { return "" } }
      let res = { status: () => {} }
      let next = sinon.spy()

      await AuthMiddleware(req, res, next)

      expect(next.calledWithMatch(Error)).to.be.true
    })
  })

})
