/**@desc Get list of sessions */
import { has, keys, sum, find, propEq, filter } from 'ramda'
import * as URL from 'url'
import { Hosts as listHosts } from '../../../services/amazon/addons'
import { Files as listFiles } from '../../../services/amazon/addons'
import { getAllLogs, deepPluck } from './index'

export default async (options?) => {
    let promises = listHosts.map((pattern) => getAllLogs(pattern, options))

    let metricsList = (await Promise.all(promises))[0].result

    metricsList = deepPluck(['message', 'payload'], metricsList)

    // let list: any = {};
    // BANDWIDTH
    // metricsList.forEach(metric => {
    //     const url = URL.parse(metric.name)
    //     if (!list[url.hostname]) {
    //         list[url.hostname] = { bytes: [], duration: [] }
    //     }
    //     let size = metric.decodedBodySize;
    //     if (metric.headers) {
    //         const isContent = (x) => has('content-length')(x)
    //         const contentlength = filter(isContent, metric.headers)[0]
    //         if (contentlength) size = parseInt(contentlength['content-length'], 10)
    //         // find(propEq('content-length'))
    //     }
    //     list[url.hostname].bytes.push(size)
    //     list[url.hostname].duration.push(metric.duration)
    // })
    // const summy = sum
    // list['content-ausc4.uplynk.com'].duration = sum(list['content-ausc4.uplynk.com'].duration)

    let hosts: any = {}

    let files: any = {}

    metricsList.forEach(pixel => {

        const url = URL.parse(pixel.name)
            , host = url.host
            , pathname = url.pathname

        const file = host + pathname;

        (has(host, hosts))
            ? hosts[host].push(pixel.duration)
            : hosts[host] = [pixel.duration];

        (has(file, files))
            ? files[file].push(pixel.duration)
            : files[file] = [pixel.duration];

    })

    hosts = keys(hosts).map(key => {
        return {
            name: key,
            duration: sum(hosts[key]) / hosts[key].length
        }
    })

    files = keys(files).map(key => {
        return {
            name: key,
            duration: sum(files[key]) / files[key].length
        }
    })

    const payload = [{
        total: keys(hosts).length,
        data: hosts,
        id: listHosts[0].id,
        label: listHosts[0].label
    }, {
        total: keys(files).length,
        data: files,
        id: listFiles[0].id,
        label: listFiles[0].label
    }]

    return payload
}