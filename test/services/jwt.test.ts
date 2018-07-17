import "../support/hooks"
import { createJwt, verifyJwt } from "app/services/jwt"

describe(__filename, () => {

  describe('createJwt', () => {
    it("should return string", async () => {
      let user = await factory.create('user')
      let res = createJwt(user)

      expect(res).be.a("string")
    })
  })

  describe('verifyJwt', () => {
    it("should have payload", async () => {
      let user = await factory.create('user')
      let token = createJwt(user)
      let res = verifyJwt(token)

      expect(res).to.have.property('user_id').eql(user.id)
      expect(res).to.have.property('iat')
      expect(res).to.have.property('exp')
    })

    it("should not have payload", async () => {
      let user = await factory.create('user')
      let token = createJwt(user)
      let res = verifyJwt(token)

      expect(res).to.not.have.property('email').eql(user.email)
    })

    it("should return error with invalid jwt", async () => {
      try {
        verifyJwt("string")
      } catch (err) {
        expect(err.message).to.have.eql("jwt malformed")
      }
    })
  })

})
