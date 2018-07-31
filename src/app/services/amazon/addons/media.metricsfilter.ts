import { IMetricsFilterAddon } from "."
import * as mappings from './marks'
/**
 * @desc 
 * @summary 
 * @requires clientsdk library on installed on client application to use this patterns.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
 **/
export const Media: IMetricsFilterAddon[] = [
    {
        id: "media:start:failure", label: "Media Start Failure", metricFilter: { path: ['event'], value: mappings.MARK.StateSessionStart },
        subpatterns: [{ metricFilter: { path: ['event'], value: mappings.MARK.StateMediaStart }, shouldExist: false }]
    },
    {
        id: "media:load:start:failure", label: "Media Load Start Failure",
        metricFilter: { path: ['event'], value: mappings.MARK.StateSessionStart },
        subpatterns: [{ metricFilter: { path: ['event'], value: mappings.MARK.StateMediaLoadStart }, shouldExist: false }]
    },
    {
        id: "player:load:failure", label: "Player Load Failure", metricFilter: { path: ['event'], value: mappings.MARK.StateSessionStart },
        subpatterns: [{ metricFilter: { path: ['event'], value: mappings.MARK.StatePlayerLoadEnd }, shouldExist: false }]
    },
    {
        id: "media:playback:complete", label: "Media Playback Complete", metricFilter: { path: ['event'], value: mappings.MARK.StateSessionStart },
        subpatterns: [{ metricFilter: { path: ['event'], value: mappings.MARK.StateMediaLoadStart }, shouldExist: true },
        { metricFilter: { path: ['event'], value: mappings.MARK.StateMediaStart }, shouldExist: true },
        { metricFilter: { path: ['event'], value: mappings.MARK.StatePlayerLoadEnd }, shouldExist: true },
        { metricFilter: { path: ['event'], value: mappings.MARK.StateMediaEnd }, shouldExist: true }]
    },
    {
        id: "session:requests", label: "Session Requests", metricFilter: { path: ['event'], value: mappings.MARK.StateSessionStart }
    },
    {
        id: "media:request:attempts", label: "Media Request Attempts", metricFilter: { path: ['event'], value: mappings.MARK.StateMediaLoadStart }
    },
    {
        id: "player:load:attempts", label: "Player Load Attempts", metricFilter: { path: ['event'], value: mappings.MARK.StatePlayerLoadEnd }
    },
    {
        id: "media:ended:plays", label: "Media Ended Plays", metricFilter: { path: ['event'], value: mappings.MARK.StateMediaEnd }
    }
]
