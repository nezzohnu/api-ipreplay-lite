import { prop } from "ramda"
import { v4 as uuid } from "uuid"
import dynamoose from "config/dynamoose"
import { addInstanseMethods, addStaticFinds } from "app/services/dynamoose"

const schema = new dynamoose.Schema({

  id: {
    type: String,
    default: uuid,
  },

  event: {
    type: String,
  },

  typeEvent: {
    type: String,
    validate: function (s) { return s === "event" || s === "tracking" },
  },

  level: {
    type: String,
  },

  payload: {
    type: Object,
  },

  state: {
    type: String,
  },

  timestamp: {
    type: Number,
  },

  sessionId: {
    type: String,
  },

  namespace: {
    required: true,
    type: String,
  },

}, {
    timestamps: true,
  })

addStaticFinds(schema)
addInstanseMethods(schema)

schema.statics.isLimitCount = async function (sessionId: string): Promise<boolean> {
  let COUNT_LIMIT = 10000
  let response = await this.scan({ sessionId }).counts().exec()
  let count = prop("count", response[0])

  if (count >= COUNT_LIMIT) {
    return true
  }

  return false
}

schema.statics.countBySessionId = async function (sessionId: string): Promise<boolean> {
  if (!sessionId) throw new Error("sessionId should be exist")

  let response = await this.scan({ sessionId }).counts().exec()
  let count = prop("count", response[0])
  return count
}

const Model = dynamoose.model('Pixel', schema)

export default Model
