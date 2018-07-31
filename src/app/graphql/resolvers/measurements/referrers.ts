/**@desc Get list of sessions */
import { countBy, pluck } from 'ramda'
import { Hosts as list } from '../../../services/amazon/addons'
import { getAllLogs, validateLogStreams, uniqueByBoolean, serializer, groupLogStreams } from './index'

export default async (options?) => {
    let promises = list.map((pattern) => getAllLogs(pattern, options))
    let payload = []
    return payload
}