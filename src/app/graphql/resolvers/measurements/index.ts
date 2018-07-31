import * as AWS from 'aws-sdk'
import { path, zipWith, reduce, equals, pluck, groupWith, keys, contains, pick } from 'ramda'
import logger from "app/services/logger"

AWS.config.region = "us-west-2"
const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })

import ads from './ads'
import browsers from './browsers'
import devices from './devices'
import errors from './errors'
import latencies from './latencies'
import medias from './medias'
import platforms from './platforms'
import referrers from './referrers'
import regions from './regions'
import sessions from './sessions'
import os from './os'
import sources from './sources'
import states from './states'

export default {
    ads,
    browsers,
    devices,
    errors,
    latencies,
    medias,
    platforms,
    referrers,
    regions,
    os,
    sessions,
    sources,
    states
}

export const deepPluck = (ppath: string[], list: object[]) => list.map(item => path(ppath, item))

export const getFilter = (metricFiler) => `{$.${metricFiler.path.join('.')} = \"${metricFiler.value}\"}`
export const getFilterComboStr = (metricFiler) => `($.${metricFiler.path.join('.')} = \"${metricFiler.value}\")`

export const uniqueByBoolean = (a) => a

export const messageToJSON = (events) => {
    try {
        events = events.map(evt => { evt.message = JSON.parse(evt.message); return evt })
        return events
    } catch (err) {
        throw err
    }
}


export const combinePattern = (filter) => {

    let subfilters = path(['subpatterns'], filter)

    delete filter.subpatterns

    let combo = [filter]

    if (subfilters) {
        combo = combo.concat(subfilters)
    }

    let filterCombo = pluck('metricFilter', combo)

    filterCombo = filterCombo.map(getFilterComboStr)

    filter.subpatterns = subfilters

    filterCombo = `{${filterCombo.join('||')}}`

    return filterCombo

}

export const groupLogStreams = (filters, events) => {

    const sameSession = (a, b) => a.logStreamName === b.logStreamName

    const grouped = groupWith(sameSession, events)

    return { filter: filters, result: grouped }

}


/**@desc Get all log events described in filters */
export const getAllLogs = async (filters, options) => {
    try {

        const patterns = combinePattern(filters)

        let { events, nextToken } = await log.filterLogEvents({ ...options, filterPattern: patterns }).promise()

        events = messageToJSON(events)

        return Promise.resolve({ filter: filters, result: events })

    } catch (err) {
        logger.info('ERROR', err)
        return Promise.resolve(err)
    }
}

/**@desc Organize log events by filter */
export const validateLogStreams = (filter, streams): object[] => {

    const main = pick(['metricFilter', 'shouldExist'], filter)
    const subs = path(['subpatterns'], filter) || []

    const patterns = [main].concat(subs)

    const validIndexes = streams.map(stream => {
        try {
            stream.forEach((pixel) => {

                const checkValid = (pattern) => {
                    const pp = pattern.metricFilter.path
                    const vv = pattern.metricFilter.value

                    const v = path(pp, pixel.message)

                    if (!equals(v, vv)) return

                    let shouldExist = path(['shouldExist'], pattern)

                    if (shouldExist === false) {
                        throw new Error('invalid')
                    }
                }

                patterns.forEach(checkValid)

            })
            return true
        } catch (err) {
            return false
        }
    })

    const createPair = (x, y) => { return { isValid: x, stream: y } }

    return zipWith(createPair, validIndexes, streams)
}


export const serializer = (streams) => {

    streams = streams.map(stream => {

        return stream.map(pixel => {

            const { logStreamName, timestamp, message, ingestionTime } = pixel

            pixel = {};

            keys(message).forEach(key =>
                (contains(key, ['payload']))
                    ? pixel[key] = JSON.stringify(message[key])
                    : pixel[key] = message[key])

            return {
                ...pixel,
                createdAt: timestamp,
                updatedAt: ingestionTime,
                logStreamName: logStreamName,
            }

        })

    })
    return streams
}