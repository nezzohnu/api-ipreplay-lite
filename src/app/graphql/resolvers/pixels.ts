import { path, merge, flatten, filter } from "ramda"
import { Pixel } from "app/models"
import { authenticated, authenticatedPublic } from "app/services/graphql"
import { can, cannot } from "app/policy"
import { awsLogs, getLogStreamNameById, getLogEvents, deleteLogStreams } from 'app/services/amazon/cwlog'
import * as AWS from 'aws-sdk'
import { GROUP_NAME } from 'app/services/amazon/groups/pixels'
import logger from "app/services/logger"
import { v4 as uuid } from "uuid"
import * as mappings from '../../services/amazon/addons/marks'
const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })

export const pixels = authenticated(async (root: any, args: any, ctx: any) => {

  const { user } = ctx

  const { limit, logStreamName, lastKey } = args.input


  const promise = getAllLogEvents({ logStreamName, logGroupName: GROUP_NAME, nextToken: lastKey, limit })

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

export const deleteSessions = authenticated(async (root: any, args: any, ctx: any) => {

  const { user } = ctx

  const { logStreamNames } = args.input

  let response: any = await deleteLogStreams({ logStreamNames, logGroupName: GROUP_NAME })

  const errors = x => x !== 'ok'

  response = filter(errors, response)

  response = response.length ? JSON.stringify(response) : 'ok'

  return { value: response, lastKey: null, namespace: user.namespace }
})

export const sessions = authenticated(async (root: any, args: any, ctx: any) => {

  const { user } = ctx
  let { limit, lastKey, endTime, startTime } = args.input

  if (!startTime) {
    // minus one day
    startTime = (new Date().getTime() - 86400000)
  }
  try {
    const res = await log.filterLogEvents({
      logGroupName: GROUP_NAME,
      interleaved: true,
      endTime,
      startTime,
      limit,
      nextToken: lastKey,
      filterPattern: `{$.event = \"${mappings.MARK.SessionData}\"}`
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
  } catch (err) {
    logger.info('ERROR', err)
    throw err
  }
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
  try {
    if (await isLimitCountPixelsBySessionId(args)) {
      throw new Error("pixels have limit by sessionId")
    }

    let sessionId;

    // create sessionId when no logStream
    if (!args.input.logStreamName) {
      sessionId = uuid()
    }

    let pixels = buildBody(args, user)

    const data = await awsLogs.pixels.addPixel(pixels, {
      logStreamName: args.input.logStreamName,
      lastKey: args.input.lastKey,
      id: sessionId
    })

    pixels = pixels.map((pixel) => {

      try {

        if (pixel.payload) pixel.payload = JSON.stringify(pixel.payload)

      } catch (err) {

        throw new Error("payload should be valid json as string")

      }

      return pixel

    })

    let response = {
      pixels: pixels,
      total: pixels.length,
      logStreamName: data.logStreamName,
      lastKey: data.lastKey,
      namespace: user.namespace,
    }
    return response

  } catch (err) {
    logger.info('ERROR', err)
    throw err
  }
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

      if (element.video) element.video = JSON.parse(element.video)

      if (element.payload) element.payload = JSON.parse(element.payload)
    } catch (err) {

      throw new Error("payload, timing, and video value should be valid json as string")
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

    return {
      ...msg,
      createdAt: item.timestamp,
      updatedAt: item.ingestionTime
    }
  })
}