import * as AWS from 'aws-sdk'
AWS.config.region = "us-west-2"
const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })

import { BrowsersAll as full } from '../../../services/amazon/addons'
import { countBy } from 'ramda'
import { Browsers as list } from '../../../services/amazon/addons'

const uniqueBrowserAndVers = (a) => [a.browser.name, a.browser.version]

export const all = async (options?) => {
    try {
        const { events, nextToken } = await log.filterLogEvents({ ...options, filterPattern: full.pattern }).promise()

        let res = events.map(evt => {
            const { browser } = JSON.parse(evt.message).payload.userAgent
            return {
                logStreamName: evt.logStreamName,
                browser: browser
            }
        })

        const count = countBy(uniqueBrowserAndVers)(res)

        return {
            count: count,
            list: res,
            nextToken: nextToken
        }
    } catch (err) {
        throw err
    }

}

// // (async () => {
// //     console.log(await all({ logGroupName: "/ipreplay-service/pixels" }))
// // })()


// export const select = async (options?) => {

// }
