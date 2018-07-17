import { namespace } from './'
import * as AWS from 'aws-sdk'
import { is } from 'ramda'
import { createLogStream } from '../cwlog'

const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })

export const GROUP_NAME = namespace + '/pixels'

/**
 * @desc Create a new log entry
 * @param {any[]}logEvents - An array of messages
 * @param {String}[options.id] - Name of stream to create. Required when stream is not provided. 
 * @param {String}[options.logStreamName] - Full stream name. When provided ID is not required. 
 * @param {String}[options.lastKey] - AWS sequence token for an existing log stream @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putLogEvents-property
 */
export const addPixel = async (logEvents: object[], options: {
    id?: string,
    logStreamName?: string,
    lastKey?: string
}) => {

    let { lastKey, logStreamName, id } = options

    if (!lastKey && !logStreamName && !id) {
        throw new Error('logStreamName or id is required to create pixel')
    }

    if (!logStreamName && id) {

        const newName = await createLogStream(GROUP_NAME, id)

        logStreamName = newName.logStreamName
    }

    let params = { logEvents: [], logGroupName: GROUP_NAME, logStreamName }

    logEvents.forEach(log => {

        let message: any = log

        if (!is(String, log)) message = JSON.stringify(log)

        params.logEvents.push({ message: message, timestamp: Date.now() })

    })

    if (lastKey) params['sequenceToken'] = lastKey

    const response = await log.putLogEvents(params).promise()

    // is error
    if (is(Error, response)) { throw response.$response.error }

    return { logGroupName: GROUP_NAME, logStreamName, lastKey: response.nextSequenceToken }

}


export const getPixels = async (options: { limit?: string, logStreamName?: string, lastKey?: string }) => {

    let { limit, logStreamName, lastKey } = options

    const params = {
        logGroupName: GROUP_NAME,
        logStreamName: logStreamName,
        startFromHead: true
    };

    if (lastKey) {
        params['nextToken'] = lastKey
    }

    if (limit) {
        params['limit'] = limit
    }

    const response = await log.getLogEvents(params).promise()

    // is error
    if (is(Error, response)) { throw response.$response.error }

    const events = response.events.map(event => {
        let temps = JSON.parse(event.message)
        temps.payload = JSON.stringify(temps.payload)
        temps.createdAt = event.timestamp
        return temps
    })

    const nextToken = (lastKey !== response.nextForwardToken) ? response.nextForwardToken : null

    return { pixels: events, nextToken }
}
