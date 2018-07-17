const userAttr = `
  id

  firstName
  lastName
  email
  acceptPrivacy
  acceptExpiration

  role
  recipient
  namespace

  publicKey

  updatedAt
  createdAt
`

const pixelAttr = `
  id

  event
  typeEvent
  level
  payload
  timing
  state
  timestamp
  sessionId
  namespace

  createdAt
  updatedAt
`

export default {
  userAttr,
  pixelAttr,

}
