import "../../support/hooks"
import { User } from "app/models"

describe(__filename, () => {

    describe("password", () => {
        it('should not equal password', async () => {
            const password = "password"
            let user = await factory.create('user', { password })

            expect(user.password).to.not.eq(password)
        })
    })

})
