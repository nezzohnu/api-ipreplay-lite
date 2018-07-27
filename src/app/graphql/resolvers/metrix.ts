import { authenticated } from "app/services/graphql"
import metrics from './metrics/index'
import { GROUP_NAME } from '../../services/amazon/groups/pixels'

import { pluck, path, keys, contains, filter } from 'ramda'

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

export const metrix = authenticated(async (root: any, args: any, ctx: any, info: any) => {

    const selections = outputTypes(info)

    const options = buildOptions(args.input)

    let metricSets = selections.map(async (metric) => {
        let result = await metrics[metric](options)
        return { result: result, metric: metric }
    })

    metricSets = await Promise.all(metricSets)

    let res = {}

    metricSets.forEach(set => res[set.metric] = set.result)

    let response = {
        ...res,
        total: keys(res).length,
        lastKey: null
    }

    return response
})

const outputTypes = (info) => {

    const validKeys = keys(metrics)

    const getKeys = (x) => contains(x, validKeys)

    let selections = path(['selectionSet', 'selections'], info.fieldNodes[0])

    if (!selections) return []

    selections = pluck('name', selections)
    selections = pluck('value', selections)

    return filter(getKeys, selections)

}