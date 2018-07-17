import * as AWS from 'aws-sdk'
AWS.config.region = "us-west-2"
const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })
import { path, isNil, reduce, equals, pluck, countBy, groupWith } from 'ramda'
import { Media as list } from '../../../services/amazon/addons'

const uniqueByBoolean = (a) => a

const parseJSONFromEvents = (events) => {
    try {
        events = events.map(evt => { evt.message = JSON.parse(evt.message); return evt })
        return events
    } catch (err) {
        throw err
    }
}


const parseFilters = (filter, combine = false) => {

    let subfilters = path(['subpatterns'], filter)

    delete filter.subpatterns

    let combo = [filter]

    if (subfilters) {
        combo = combo.concat(subfilters)
    }

    let list = pluck('pattern', combo)

    if (combine) {
        list = list.map(item => {
            item = item.replace('{', '(')
            item = item.replace('}', ')')
            return item
        })
    }
    filter.subpatterns = subfilters

    return list

}

const getLogEvents = async (filters, options) => {
    try {
        const patterns = parseFilters(filters, true)

        const filtas = `{${patterns.join('||')}}`

        let { events, nextToken } = await log.filterLogEvents({ ...options, filterPattern: filtas }).promise()

        events = parseJSONFromEvents(events)

        const sameSession = (a, b) => a.message.sessionId === b.message.sessionId

        const grouped = groupWith(sameSession, events)

        return Promise.resolve({ filter: filters, result: grouped })

    } catch (err) {
        console.log(err)
        return Promise.resolve(err)
    }
}

/**@desc Find all matches */
const matchFilterPattern = ({ filter, result }) => {

    const subpatterns = path(['subpatterns'], filter)

    // first item is the mainPattern and always true
    let matchPattern = [true]

    if (subpatterns) {
        subpatterns.forEach(pattern => matchPattern.push(pattern.shouldExist))
    }

    const matchLogEvents = (logs) => {
        let results = matchPattern.map((val, i) => !isNil(logs[i]) === val)

        return reduce(equals, true, results)
    }

    const matches = result.map(matchLogEvents)

    return { filter, result, matches }
}

const all = async (options) => {
    let promises = list.map((pattern) => getLogEvents(pattern, options))

    const metricsList = await Promise.all(promises)

    const payload = []

    metricsList.forEach(metrics => {

        const items = matchFilterPattern(metrics)
        const count = countBy(uniqueByBoolean)(items.matches)

        payload.push({
            count: count['true'],
            total: items.matches.length,
            list: items.result,
            label: items.filter.label,
            id: items.filter.id
        })
    })

    return payload
}

(async () => {
    const results = await all({ logGroupName: "/ipreplay-service/pixels" })
    console.log(JSON.stringify(results))
})()
