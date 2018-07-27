import { IMetricsFilterAddon } from "."
import * as mappings from './marks'
/**
 * @desc List of AWS Metric patterns to filter log data.
 * @summary States mark the start and end of a time period when measurements are recorded.
 * @requires clientsdk library on installed on client application to use this patterns.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
 **/


export const SessionState: IMetricsFilterAddon[] = [
    //Session Loading or Page Loading should be triggered as early as possible
    { id: "state:session:start", label: "State Session Start", metricFilter: { path: ['event'], value: mappings.MARK.StateSessionStart } },
    //Session Unload or Window Unload should be triggered when session is closed
    { id: "state:session:end", label: "State Session End", metricFilter: { path: ['event'], value: mappings.MARK.StateSessionEnd } }
]
