import { IMetricsFilterAddon } from "."
import * as mappings from './marks'

export const Files: IMetricsFilterAddon[] = [{ label: "All Files", metricFilter: { path: ["event"], value: 'resource' }, id: "files:all" }]

export const Hosts: IMetricsFilterAddon[] = [{ label: "All Hosts", metricFilter: { path: ["event"], value: 'resource' }, id: "hosts:all" }]