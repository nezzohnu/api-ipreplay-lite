import "../../support/hooks"
import { User } from "app/models"

describe(__filename, () => {

  describe("attributes", () => {
    let user

    beforeEach(async () => {
      user = await factory.create("user")
    })

    it("should have attributes", async () => {
      const attributes = [
        "id",
        "lastName",
        "phone",
        "confirmAttempts",
        "email",
        "acceptExpiration",
        "role",
        "deleteUser",
        "confirmEmail",
        "confirmCode",
        "firstName",
        "password",
        "acceptPrivacy",
        "emailStatus",
        "createdAt",
        "updatedAt",
        "publicKey",
        // "subscribeToLogCompany",
        // "subscribeToLogEvent",
        // "subscribeToLogUser",
        // "subscribeToLogUserAdmin",
      ]

      user = await User.findById(user.id)

      attributes.map((attrubute) => {
        expect(user).to.have.property(attrubute).eql(user[attrubute])
      })
    })
  })

})
