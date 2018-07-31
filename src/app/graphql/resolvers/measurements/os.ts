import { countBy, pluck, flatten } from 'ramda'
import { DeviceOS as list } from '../../../services/amazon/addons'
import { getAllLogs, validateLogStreams, serializer, groupLogStreams } from './index'

const uniqueNameAndVersion = (a) => [a.os.name, a.os.version]

export default async (options?) => {
    let promises = list.map((pattern) => getAllLogs(pattern, options))

    let metricsList = await Promise.all(promises)

    metricsList = metricsList.map(metrics => groupLogStreams(metrics.filter, metrics.result))

    const payload = []

    metricsList.forEach(metrics => {
        try {
            const result = validateLogStreams(metrics.filter, metrics.result)

            let items = pluck('stream', result)

            items = flatten(items)

            const userAgent = items.map(stream => stream.message.payload.userAgent)

            const matches = countBy(uniqueNameAndVersion)(userAgent)

            const streams = pluck('stream', result)

            const data = serializer(streams)

            payload.push({
                total: JSON.stringify(matches),
                streamsSearched: result.length,
                data: data,
                label: metrics.filter.label,
                id: metrics.filter.id
            })

        } catch (err) {
            console.log(err)
        }

    })

    return payload

}
