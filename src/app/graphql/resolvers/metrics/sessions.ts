/**@desc Get list of sessions */
import { countBy, pluck } from 'ramda'
import { SessionState as list } from '../../../services/amazon/addons'
import { getAllLogs, validateLogStreams, uniqueByBoolean, serializer, groupLogStreams } from './index'


export default async (options?) => {
    let promises = list.map((pattern) => getAllLogs(pattern, options))

    let metricsList = await Promise.all(promises)

    metricsList = metricsList.map(metrics => groupLogStreams(metrics.filter, metrics.result))

    const payload = []

    metricsList.forEach(metrics => {

        const result = validateLogStreams(metrics.filter, metrics.result)
        const matches = countBy(uniqueByBoolean)(pluck('isValid', result))

        const streams = pluck('stream', result)

        const data = serializer(streams)

        payload.push({
            total: matches['true'],
            streamsSearched: result.length,
            data: data,
            label: metrics.filter.label,
            id: metrics.filter.id
        })
    })

    return payload
}