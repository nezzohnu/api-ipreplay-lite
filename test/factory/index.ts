import * as faker from "faker"
import { factory } from "factory-girl"
import {
  User,
  Pixel,
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

factory.define('userGuest', User, {
  firstName: faker.name.findName,
  lastName: faker.name.findName,
  email: faker.internet.email,
  phone: faker.internet.email,
  password: faker.name.findName,
  acceptPrivacy: false,
  acceptExpiration: false,
  role: "guest",
})

factory.define('pixel', Pixel, {
  event: faker.name.findName,
  typeEvent: "event",
  level: faker.name.findName,
  payload: {
    event: "event",
    tracking: "tracking",
  },
  timing: { timestamp: new Date().getTime() },
  state: faker.name.findName,
  timestamp: new Date().getTime(),
  sessionId: faker.name.findName,
  namespace: faker.name.findName,
})

export default factory


// factory.define('userAdmin', User, {
//   firstName: faker.name.findName,
//   lastName: faker.name.findName,
//   email: faker.internet.email,
//   password: faker.name.findName,
//   acceptPrivacy: false,
//   acceptExpiration: false,
//   role: "admin",
// })

// factory.define('userRoot', User, {
//   firstName: faker.name.findName,
//   lastName: faker.name.findName,
//   email: faker.internet.email,
//   password: faker.name.findName,
//   acceptPrivacy: false,
//   acceptExpiration: false,
//   role: "root",
// })

// factory.define('campaign', Campaign, {
//   sender: faker.name.findName,
//   subject: faker.name.findName,
//   dateScheduled: faker.date.past,
//   html: faker.name.findName,
//   active: true,
// })

// factory.define('campaignWithUser', Campaign, {
//   sender: faker.name.findName,
//   subject: faker.name.findName,
//   dateScheduled: faker.date.past,
//   html: faker.name.findName,

//   user: factory.assoc('user', "_id"),
// })

// factory.define('recipient', Recipient, {
//   email: faker.internet.email,
//   status: "wait",
// })

// factory.define('recipientWithCampaign', Recipient, {
//   email: faker.internet.email,
//   campaign: factory.assoc("campaign", "_id"),
//   status: "wait",
// })

// factory.define('company', Company, {
//   name: faker.name.findName,
// })

// factory.define('log', Log, {
//   level: "log",
//   response: {
//     test: "test",
//   },
//   request: {
//     request: "test",
//   },
//   user: "5ad5a562bc780a21654454e7",
//   relay: "relay",
//   namespace: "namespace",
// })

// factory.define('event', Event, {
//   eventName: faker.name.findName,
//   namespace: faker.name.findName,
// })

// factory.define('email', Email, {
//   email: faker.internet.email,
//   campaign: "campaign.id",
// })

// factory.define('history', History, {
//   userAgent: faker.name.findName,
//   ip: faker.name.findName,
// })
