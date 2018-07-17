import { IMetricsFilterAddon } from ".";

/**
 * @desc 
 * @summary 
 * @requires clientsdk library on installed on client application to use this patterns.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
 **/
export const Media: IMetricsFilterAddon[] = [
    {
        id: "media:start:failure", label: "Media Start Failure", pattern: "{$.event = \"nx:state:page:loading\"}",
        subpatterns: [{ matchKeyPath: ["sessionId"], pattern: "{$.event = \"nx:state:media:start\"}", shouldExist: false }]
    },
    {
        id: "media:load:start:failure", label: "Media Load Start Failure", pattern: "{$.event = \"nx:state:page:loading\"}",
        subpatterns: [{ matchKeyPath: ["sessionId"], pattern: "{$.event = \"media:load:start\"}", shouldExist: false }]
    },
    {
        id: "player:load:failure", label: "Player Load Failure", pattern: "{$.event = \"nx:state:page:loading\"}",
        subpatterns: [{ matchKeyPath: ["sessionId"], pattern: "{$.event = \"nx:state:player:loaded\"}", shouldExist: false }]
    },
    {
        id: "media:playback:complete", label: "Media Playback Complete", pattern: "{$.event = \"nx:state:page:loading\"}",
        subpatterns: [
            { matchKeyPath: ["sessionId"], pattern: "{$.event = \"nx:state:media:start\"}", shouldExist: true },
            { matchKeyPath: ["sessionId"], pattern: "{$.event = \"media:load:start\"}", shouldExist: true },
            { matchKeyPath: ["sessionId"], pattern: "{$.event = \"nx:state:player:loaded\"}", shouldExist: true },
            { matchKeyPath: ["sessionId"], pattern: "{$.event = \"nx:state:media:complete\"}", shouldExist: true }]
    },
    {
        id: "media:start:time", label: "Media Start Time", pattern: "{$.timing.name = \"nx:state:media:start\"}"
    },
    {
        id: "session:requests", label: "Session Requests", pattern: "{$.event = \"nx:state:page:loading\"}"
    },
    {
        id: "media:request:attempts", label: "Media Request Attempts", pattern: "{$.event = \"nx:state:media:request\"}"
    },
    {
        id: "player:load:attempts", label: "Player Load Attempts", pattern: "{$.event = \"nx:state:player:loaded\"}"
    },
    {
        id: "media:ended:plays", label: "Media Ended Plays", pattern: "{$.event = \"media:end\"}"
    }
]
