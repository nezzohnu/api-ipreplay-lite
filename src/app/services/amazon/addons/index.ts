export * from './browser.metricsfilter'
export * from './default.metricsfilter'
export * from './device.metricsfilter'
export * from './media.metricsfilter'

/**
 * @desc Metrics Filter interface
 * @param {string} label Friendly name of filter
 * @param {string} pattern Main filter pattern
 * @param {string[]} subpatterns Apply additional patterns to the result of the pattern.  Subpatterns are applied in listed order.
 */
export interface IMetricsFilterAddon {
    id: string;
    label: string;
    pattern: string;
    subpatterns?: ISubMetricsFilterPattern[]
}

/**
 * @desc Metrics Filter Subpattern interface
 * @param {string[]} matchKeyPath Match a key from the result of the parent pattern to the result of this key.  
 * @param {string} pattern Filter pattern
 * @param {boolean} shouldExist Should this event be present
 * @example 
 * parentResult = {
    "event": "nx:state:page:loading",
    "timing": {
        "name": "nx:state:page:loading",
        "entryType": "mark",
        "startTime": 2862,
        "duration": 0
    },
    "level": "info",
    "payload": {
        "duration": 0,
        "timestamp": "1531637558626",
        "windowID": "e7633880ae",
        "pageID": "f86c4335db"
    },
    "state": "nx:state:page:loading",
    "timestamp": "1531637558671",
    "sessionId": "0a8cc314-ba01-3918-b74a-6b76596e6d2f",
    "namespace": "urn:ipreplay:98e1e416-12e0-41cf-94ac-2305acbd9b96"
    }
    ...
    {
        label: "Media Start Failure", pattern: "{$.event = \"nx:state:page:loading\"}",
        subpatterns: [{matchKeyPath:["payload","windowID"], pattern: "{$.event = \"media:play\"}"}]
    }
    The subpattern look for additional logEvents with the matching key/value 'payload.windowID = e7633880ae' and pattern.
 */
export interface ISubMetricsFilterPattern {
    matchKeyPath: string[];
    pattern: string;
    shouldExist: boolean;
}