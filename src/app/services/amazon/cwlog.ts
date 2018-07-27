import * as AWS from 'aws-sdk'
import { is, without, keys } from 'ramda'
import settings from 'config/settings'
const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })

import * as pixels from './groups/pixels'

import { v4 as uuid } from "uuid"

export const awsLogs = {
    pixels: pixels,
}

/**
 * @todo Does not support encrypted logs
 */
const createGroup = async (name) => {

    const params = { logGroupName: name }

    return await log.createLogGroup(params).promise()

}

const validateLogGroups = async () => {

    const groups = keys(awsLogs).map(key => awsLogs[key].GROUP_NAME)

    var params = {
        logGroupNamePrefix: `${settings.aws_serverless_service}/`
    }

    const response = await log.describeLogGroups(params).promise()

    let list = []

    if (response.logGroups.length) {

        list = response.logGroups.map((group) => group.logGroupName)

    }

    const buildGroup = without(list, groups)

    buildGroup.forEach(async (group) => {
        createGroup(group)
    })

}

export const filterLogs = async ({ interleaved, endTime, startTime, limit, nextToken, filterPattern }) => {
    const res = await log.filterLogEvents({
        logGroupName: pixels.GROUP_NAME,
        interleaved,
        endTime,
        startTime,
        limit,
        nextToken,
        filterPattern
    }).promise()

    if (!res.events) { throw new Error('Data unavailable') }

    return { nextToken: res.nextToken, events: res.events }
}

export const getLogStreamNameById = (id) => {
    const prefix = new Date().toJSON().split('T')[0].replace(/\-/g, "/")

    const logStreamName = prefix + '/' + id

    return logStreamName
}

export const createLogStream = async (groupName, uid?) => {

    const id = uid || uuid()

    const logStreamName = getLogStreamNameById(id)

    const params = {
        logStreamName: logStreamName,
        logGroupName: groupName
    }

    const response = await log.createLogStream(params).promise()

    // is error
    if (is(Error, response)) { throw response.$response.error }

    return { logStreamName }
}

export const getLogEvents = async (options: { logStreamName, logGroupName, endTime?, limit?, nextToken?, startFromHead?, startTime?}) => {

    const { logStreamName, logGroupName, endTime, limit, nextToken, startFromHead, startTime } = options

    let params = { logStreamName, logGroupName, limit, startFromHead, startTime, endTime, nextToken }

    const lists = await log.getLogEvents(params).promise()

    return Promise.resolve(lists)
}

validateLogGroups()
