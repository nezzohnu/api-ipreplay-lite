import { namespace } from './'
import * as AWS from 'aws-sdk'
import { is, contains } from 'ramda'
import { createLogStream, getLogStreamNameById, getLogEvents } from '../cwlog'

const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })

export const GROUP_NAME = namespace + '/sessions'

const getNextToken = async (groupName) => {

    const params = {
        limit: 1, // only recent stream
        logGroupName: groupName,
        descending: true,
        orderBy: 'LastEventTime'
    }

    let nextToken = null;
    let logStreamName = null;

    const response = await log.describeLogStreams(params).promise()

    // is error
    if (is(Error, response)) { throw response.$response.error }

    const { logStreams } = response

    let now = [new Date().getMonth(), new Date().getDate()]

    logStreams.forEach(stream => {

        let lastEvent = new Date(stream.lastEventTimestamp)

        let sampleDate = [lastEvent.getMonth(), lastEvent.getDate()]

        if (contains(now, [sampleDate])) {

            nextToken = stream.uploadSequenceToken

            logStreamName = stream.logStreamName

        }
    })

    console.log('nextoken: ', nextToken)
    return { nextToken, logStreamName }
}

export const getSessionEvents = async (options: { logStreamName, logGroupName, endTime?, limit?, nextToken?, startFromHead?, startTime?}) => {

    const { logStreamName, endTime, limit, nextToken, startFromHead, startTime } = options

    let params = { logStreamName, logGroupName: GROUP_NAME, limit, startFromHead, startTime, endTime, nextToken }
    console.log(params)
    const lists = await log.getLogEvents(params).promise()
    console.log(lists.nextBackwardToken, lists.nextForwardToken)
    return Promise.resolve(lists)
}

export const getSessions = async (options: { limit?: string, lastKey?: string }) => {

    let { limit, lastKey } = options

    let params = {
        logGroupName: GROUP_NAME,
        limit: parseInt(limit),
        orderBy: 'LastEventTime',
        descending: true,
    };

    if (lastKey) {
        params['nextToken'] = lastKey
    }

    const response = await log.describeLogStreams(params).promise()

    // is error
    if (is(Error, response)) { throw response.$response.error }

    delete params.descending
    delete params.orderBy

    const sessions = response.logStreams.map(ls => {

        return {
            createdAt: ls.creationTime,
            updatedAt: ls.lastEventTimestamp,
            lastKey: ls.uploadSequenceToken,
            logStreamName: ls.logStreamName
        }
    })

    return { sessions, nextToken: response.nextToken }
}


export const addSession = async (logEvents?: object[]) => {
    try {
        let params = { logEvents: [], logGroupName: GROUP_NAME, logStreamName: '' }

        logEvents.forEach(log => {

            let message: any = log

            if (is(Object, log)) message['logStreamName'] = getLogStreamNameById(message.sessionId)

            if (!is(String, log)) message = JSON.stringify(log)

            params.logEvents.push({ message: message, timestamp: Date.now() })

        })

        let { nextToken, logStreamName } = await getNextToken(GROUP_NAME)

        if (nextToken) { params['sequenceToken'] = nextToken }

        if (!logStreamName) {

            const newStream = await createLogStream(GROUP_NAME)

            logStreamName = newStream.logStreamName

        }

        params['logStreamName'] = logStreamName

        const response = await log.putLogEvents(params).promise()

        // is error
        if (is(Error, response)) { throw response.$response.error }

        return { logStreamName, logGroupName: GROUP_NAME, lastKey: response.nextSequenceToken };

    } catch (error) {
        throw error
    }


}
// addSession()

// const sessions = data.logStreams.map(ls => {

//     const sessionId = ls.logStreamName.split('/')
//     let tmp = {
//         createdAt: ls.creationTime,
//         updatedAt: ls.lastEventTimestamp,
//         timestamp: ls.creationTime,
//         sessionId: sessionId[sessionId.length - 1],
//         lastKey: ls.uploadSequenceToken,
//         logStreamName: ls.logStreamName
//     }
//     return tmp
// })
// resolve({ ...data, sessions })