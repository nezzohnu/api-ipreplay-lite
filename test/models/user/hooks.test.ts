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

  // describe("namespace", () => {
  //   describe("with company", async () => {
  //     it('should return string', async () => {
  //       let company = await factory.create('company')
  //       let user = await factory.create('user', { company: company.id })
  //       const namespace = `urn:ipreplay:${company.id}`

  //       expect(user.namespace).to.eq(namespace)
  //     })
  //   })

  //   describe("without company", async () => {
  //     it('should return string', async () => {
  //       let user = await factory.create('user')
  //       const namespace = `urn:ipreplay:${user.id}`

  //       expect(user.namespace).to.eq(namespace)
  //     })
  //   })
  // })

})
