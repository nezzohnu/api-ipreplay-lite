import { IMetricsFilterAddon } from '.'
import * as mappings from './marks'

export const Errors: IMetricsFilterAddon[] = [
    { id: "nx:media:error", label: "Media Error", metricFilter: { path: ['event'], value: mappings.MARK.MediaError } },
    { id: "nx:media:console:error", label: "Media Console Error", metricFilter: { path: ['event'], value: 'error' } }
]