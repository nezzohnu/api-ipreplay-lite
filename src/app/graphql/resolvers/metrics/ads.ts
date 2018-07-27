/**@desc Get list of ads */
import * as AWS from 'aws-sdk'
AWS.config.region = "us-west-2"
const log = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' })
import { BrowsersAll as full } from '../../../services/amazon/addons'
import { countBy } from 'ramda'

export default async (pattern, options?) => {

}