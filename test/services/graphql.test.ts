import "../support/hooks"
import { setCookieHeader, getTokenFromHeaderOrCookie } from "app/services/graphql"

describe(__filename, () => {

  describe('getTokenFromHeaderOrCookie', () => {
    describe('empty params', () => {
      it("should return string", async () => {
        const jwt = "jwt-token"

        let event = {}

        let res = getTokenFromHeaderOrCookie(event.headers)

        expect(res).to.eql(undefined)
      })
    })

    describe('cookie', () => {
      it("should return string", async () => {
        const jwt = "jwt-token"

        let event = {
          headers: {
            Cookie: `ipreplay=${jwt}; Max-Age=60; Domain=localhost:8081; HttpOnly; Secure`
          }
        }

        let res = getTokenFromHeaderOrCookie(event.headers)

        expect(res).to.eql(jwt)
      })
    })

    describe('token', () => {
      it("should return string for Authorization", async () => {
        const jwt = "jwt-token"

        let event = {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }

        let res = getTokenFromHeaderOrCookie(event.headers)

        expect(res).to.eql(jwt)
      })

      it("should return string for authorization", async () => {
        const jwt = "jwt-token"

        let event = {
          headers: {
            authorization: `Bearer ${jwt}`
          }
        }

        let res = getTokenFromHeaderOrCookie(event.headers)

        expect(res).to.eql(jwt)
      })

    })
  })

  describe('setCookieHeader', () => {
    it("should return string", async () => {
      let res = {
        headers: {},
        setHeader: function (key, value) { this.headers[key] = value },
      }

      let jwt = "jwt key"

      setCookieHeader(res, jwt)

      expect(res.headers["Set-Cookie"]).to.eql('ipreplay=jwt%20key; Max-Age=3600000; Domain=http://localhost:8080; Path=/; HttpOnly')
    })
  })

})
