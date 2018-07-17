import { path, merge, flatten } from "ramda"
import { Pixel } from "app/models"
import { authenticated, authenticatedPublic } from "app/services/graphql"
import { can, cannot } from "app/policy"
import { awsLogs, getLogStreamNameById, getLogEvents } from 'app/services/amazon/cwlog'
import * as AWS from 'aws-sdk'
const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })

export const pixels = authenticated(async (root: any, args: any, ctx: any) => {

  const { user } = ctx

  const { limit, logStreamName, lastKey } = args.input


  const promise = getAllLogEvents({ logStreamName, logGroupName: awsLogs.pixels.GROUP_NAME, nextToken: lastKey, limit })

  let pixels = await Promise.all([promise])

  pixels = buildPixelsList(flatten(pixels))

  let response = {
    pixels,
    namespace: user.namespace,
    total: pixels.length,
    lastKey: null
  }

  return response
})

export const sessions = authenticated(async (root: any, args: any, ctx: any) => {

  const { user } = ctx
  const { limit, lastKey, endTime, startTime } = args.input

  const res = await log.filterLogEvents({
    logGroupName: '/ipreplay-service/pixels',
    interleaved: true,
    endTime,
    startTime,
    limit,
    nextToken: lastKey,
    filterPattern: "{$.event = \"app:session:data\"}"
  }).promise()

  if (!res.events) { throw new Error('Session data unavailable') }

  let items = [];

  items = res.events.map(event => {
    const message: any = JSON.parse(event.message)
    return {
      timestamp: message.timestamp,
      sessionId: message.sessionId,
      userId: message.payload.userId,
      logStreamName: event.logStreamName,
      createdAt: String(event.timestamp),
      updatedAt: String(event.ingestionTime)
    }
  })

  let response = {
    sessions: items,
    namespace: user.namespace,
    total: items.length,
    lastKey: res.nextToken,
  }

  return response

})


export const createPixels = authenticatedPublic(async (root: any, args: any, ctx: any) => {

  const { user } = ctx

  const body = buildBody(args, user)

  if (await isLimitCountPixelsBySessionId(args)) {
    throw new Error("pixels have limit by sessionId")
  }

  const createPixel = async (body) => await Pixel.create(body)

  let pixels: any = await Promise.all(await body.map(createPixel))

  pixels = pixels.map((pixel) => {

    try {

      if (pixel.payload) pixel.payload = JSON.stringify(pixel.payload)

    } catch (err) {

      throw new Error("payload should be valid json as string")

    }

    return pixel
  })

  const sessionId = getSessionIdMeta(args)

  const total = sessionId ? await Pixel.countBySessionId(sessionId) : null

  let response = {
    pixels,
    total,
    namespace: user.namespace,
  }

  return response
})

export const createPixelsJob = authenticatedPublic(async (root: any, args: any, ctx: any) => {
  const { user } = ctx

  if (await isLimitCountPixelsBySessionId(args)) {
    throw new Error("pixels have limit by sessionId")
  }

  const body = buildBody(args, user)
  // console.log(body)
  //NOTE: paranoia
  const sessionId = body[0].sessionId || body[1].sessionId || body[2].sessionId

  // try {
  const data = await awsLogs.pixels.addPixel(body, {
    logStreamName: args.input.logStreamName,
    lastKey: args.input.lastKey,
    id: sessionId
  })
  let response = {
    value: "pixels send in a background job",
    logStreamName: data.logStreamName,
    lastKey: data.lastKey,
    namespace: user.namespace,
  }
  return response
  // } catch (err) {
  //   console.log(err)
  //   return null
  // }


})

const isLimitCountPixelsBySessionId = async (args) => {
  let sessionId = path(["input", 'meta', "sessionId"], args)
  if (!sessionId) return
  return await Pixel.isLimitCount(sessionId)
}

const buildQuery = (args, user) => {
  const { sessionId = null, namespace = null, timestampStart = null, timestampEnd = null } = path(['input'], args) || {}
  let query: any = {}

  if (can(user, "readAnyPixel", Pixel)) {
    if (namespace) query = merge({ namespace }, query)
  } else {
    query = merge({ namespace: user.namespace }, query)
  }

  if (sessionId) {
    query = merge({ sessionId }, query)
  }

  if (timestampStart && timestampEnd) {
    let timestampStartInt = parseInt(timestampStart)
    let timestampEndInt = parseInt(timestampEnd)

    query = merge({
      timestamp: {
        between: [timestampStartInt, timestampEndInt]
      }
    }, query)

  } else {

    if (timestampStart) {
      let timestampStartInt = parseInt(timestampStart)

      query = merge({
        timestamp: {
          gt: timestampStartInt,
        }
      }, query)
    }

    if (timestampEnd) {
      let timestampEndInt = parseInt(timestampEnd)

      query = merge({
        timestamp: {
          lt: timestampEndInt,
        }
      }, query)
    }

  }

  return query
}

const getSessionIdMeta = (args) => path(["input", 'meta', "sessionId"], args)

const buildBody = (args, user) => {
  let body = path(["input", 'pixels'], args) || []
  let meta = path(["input", 'meta'], args) || {}

  if (!(body instanceof Array)) body = [body]

  const addMeta = (element) => merge(element, meta)
  const addNamespace = (element) => merge(element, { namespace: user.namespace })
  const checkAndAddNamespace = (element) => {
    if (!element.namespace) {
      return merge(element, { namespace: user.namespace })
    } else {
      return element
    }
  }

  const changePayloadAsJson = (element) => {
    try {

      if (element.timing) element.timing = JSON.parse(element.timing)

      if (element.payload) element.payload = JSON.parse(element.payload)
    } catch (err) {

      throw new Error("payload and timing should be valid json as string")
    }
    return element
  }

  let res = body.map(addMeta)

  if (cannot(user, "readAnyPixel", Pixel)) res = res.map(addNamespace)

  res = res.map(checkAndAddNamespace)
  res = res.map(changePayloadAsJson)

  return res
}

const getAllLogEvents = async (options: { logStreamName, logGroupName, endTime?, limit?, nextToken?, startFromHead?, startTime?}) => {

  return new Promise(async (resolve, reject) => {

    let hasMore = true
    let list = []

    do {

      const { events, nextForwardToken } = await getLogEvents(options)

      if (!events.length) {
        hasMore = false;
        resolve(list);
        break;
      }

      events.forEach(event => list.push(event))

      options.nextToken = nextForwardToken

    } while (hasMore)

  })
}

const buildSessionList = (sessions) => {
  return sessions.map(item => {

    const msg = JSON.parse(item.message)

    let { timestamp, sessionId, payload, logStreamName, namespace } = msg

    if (!logStreamName) {
      logStreamName = getLogStreamNameById(sessionId)
    }

    return {
      timestamp,
      sessionId,
      userId: payload.userId,
      logStreamName,
      namespace,
      createdAt: item.timestamp,
      updatedAt: item.ingestionTime
    }
  })
}

const buildPixelsList = (pixels) => {
  return pixels.map(item => {

    const msg = JSON.parse(item.message)

    msg.payload = JSON.stringify(msg.payload)

    if (msg.timing) { msg.timing = JSON.stringify(msg.timing) }

    return {
      ...msg,
      createdAt: item.timestamp,
      updatedAt: item.ingestionTime
    }
  })
}