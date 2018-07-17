import { IMetricsFilterAddon } from ".";

/**
 * @desc List of AWS Metric patterns to filter log data.
 * @summary States mark the start and end of a time period when measurements are recorded.
 * @requires clientsdk library on installed on client application to use this patterns.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
 **/
export const SessionState: IMetricsFilterAddon[] = [
    //Session Loading or Page Loading should be triggered as early as possible
    { id: "state:session:loading", label: "State Session Loading", pattern: "{$.event = \"nx:state:session:loading\"}" },
    { id: "state:page:loading", label: "State Page Loading", pattern: "{$.event = \"nx:state:page:loading\"}" },

    //Session Unload or Window Unload should be triggered when session is closed
    { id: "state:session:unload", label: "State Session Unload", pattern: "{$.event = \"nx:state:session:unload\"}" },
    { id: "state:page:unload", label: "State Page Unload", pattern: "{$.event = \"nx:state:unload\"}" },
]
