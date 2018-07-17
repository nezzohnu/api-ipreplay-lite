import * as faker from "faker"
import { factory } from "factory-girl"
import {
  User,
  // Email,
} from "app/models"

factory.define('user', User, {
  firstName: faker.name.findName,
  lastName: faker.name.findName,
  email: faker.internet.email,
  phone: faker.internet.email,
  password: faker.name.findName,
  acceptPrivacy: false,
  acceptExpiration: false,
  role: "guest",
})

// factory.define('email', Email, {
//   email: faker.internet.email,
//   campaign: "campaign.id",
// })


export default factory
