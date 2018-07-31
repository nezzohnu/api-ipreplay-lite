import { IMetricsFilterAddon } from "."
import * as mappings from './marks'

export const Timing: IMetricsFilterAddon[] = [
    {
        id: "player:load:time", label: "Player Start Time", metricFilter: { path: ['event'], value: mappings.MARK.StatePlayerLoadEnd }
    },
    {
        id: "media:start:time", label: "Media Start Time", metricFilter: { path: ['event'], value: mappings.MARK.StateMediaStart }
    }
]

// export const Concurreny: IMetricsFilterAddon[] = [
//     {
//         id: "media:minutes:played", label: "Media Minutes Played", metricFilter: { path: ['event'], value: mappings.MARK.StateMediaStart }
//     },
//     {
//         id: "media:playback:count", label: "Media Playback Count", metricFilter: { path: ['event'], value: mappings.MARK.StateMediaStart }
//     },
//     {
//         id: "media:play", label: "Media Plays", metricFilter: { path: ['event'], value: mappings.MARK.StateMediaStart }
//     }
// ]