import "../support/hooks"
import config from "app/graphql/config"
import * as sinon from "sinon"

describe(__filename, () => {

  describe(`valid params given`, async () => {
    const jwt = "JWT"
    let result

    beforeEach(async () => {
      const req = {
        headers: {
          "authorization": `Bearer ${jwt}`,
        }
      }
      const res = sinon.spy()

      result = config(req, res)
    })

    it(`should return token`, async () => {
      expect(result.context.token).to.eql(jwt)
    })

  })

})
