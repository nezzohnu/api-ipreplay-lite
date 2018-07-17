import { path } from "ramda"
import { User } from "app/models"
// import { errorSerializer } from "app/serializers"

export const createLog = async ({ req, res, response }) => {
  const relay = getRelay(response)
  const request  = req.body
  const { io, user, } = req

  if (!relay) return

  res.header("x-relay", relay)

  if (!user) return

  // const log = await Log.createObject({
  //   response,
  //   request,
  //   user,
  //   relay,
  // })

  // let event = await Event.findOne({
  //   eventName: relay,
  //   namespace: user.namespace,
  // })

  // if (!event) return

  // await ioEmit(io, relay, log)
}

export const createError = async ({ req, res, err }) => {
  // const response = errorSerializer(err)
  // const request = req.body
  // const relay = getRelay(response)
  // const { io, user } = req

  // if (!relay) return
  // if (!user) return

  // res.header("x-relay", relay)

  // const log = await Log.createObject({
  //   level: "error",
  //   response,
  //   request,
  //   user,
  //   relay,
  // })

  // let event = await Event.findOne({
  //   eventName: relay,
  //   namespace: user.namespace,
  // })

  // if (!event) return

  // await ioEmit(io, relay, log)
}

const getRelay = path(["meta", "relay"])
const ioEmit = async (io, relay, log) => io.of(log.namespace).emit(relay, log)
