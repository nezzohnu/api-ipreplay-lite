import { authenticated } from "app/services/graphql"
import measurements from './measurements'
import { GROUP_NAME } from '../../services/amazon/groups/pixels'
import logger from "app/services/logger"
import { keys, contains } from 'ramda'

const buildOptions = (input) => {
    const list = ["limit", "type", "byVideoId", "lastKey", "startTime", "endTime", "nextToken"]

    let options = {}

    keys(input).forEach(
        key => (contains(key, list))
            ? options[key] = input[key]
            : undefined)

    options['logGroupName'] = GROUP_NAME

    return options
}

export const metricsBrowser = authenticated(async (root: any, args: any, ctx: any, info: any) => {
    try {
        return await metrics(root, args, ctx, info, "browsers")
    } catch (err) {
        logger.info("ERROR", err)
    }
})

export const metricsError = authenticated(async (root: any, args: any, ctx: any, info: any) => {
    try {
        return await metrics(root, args, ctx, info, "errors")
    } catch (err) {
        logger.info("ERROR", err)
    }
})

export const metricsLatency = authenticated(async (root: any, args: any, ctx: any, info: any) => {
    try {
        return await metrics(root, args, ctx, info, "latencies")
    } catch (err) {
        logger.info("ERROR", err)
    }
})
export const metricsMedia = authenticated(async (root: any, args: any, ctx: any, info: any) => {
    try {
        return await metrics(root, args, ctx, info, "medias")
    } catch (err) {
        logger.info("ERROR", err)
    }
})
export const metricsOs = authenticated(async (root: any, args: any, ctx: any, info: any) => {
    try {
        return await metrics(root, args, ctx, info, "os")
    } catch (err) {
        logger.info("ERROR", err)
    }
})
export const metricsSession = authenticated(async (root: any, args: any, ctx: any, info: any) => {
    try {
        return await metrics(root, args, ctx, info, "sessions")
    } catch (err) {
        logger.info("ERROR", err)
    }
})

const metrics = async (root: any, args: any, ctx: any, info: any, metric: string) => {
    try {
        const options = buildOptions(args.input)

        let result = (await measurements[metric](options))

        let response = {
            data: result,
            collections: result.length,
            lastKey: null
        }

        return response
    } catch (err) {
        logger.info('ERROR', err)
    }
}
