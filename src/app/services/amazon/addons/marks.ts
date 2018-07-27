export enum MARK {
    StateSessionStart = "nx:state:session:start",//// set as early as <HTML> open tag
    StateAppLoadStart = "nx:state:app:load:start", /// immediately before application starts loading
    StateAppLoadEnd = "nx:state:app:load:end", /// immediately after application completes loading
    StatePlayerLoadStart = "nx:state:player:load:start", /// immediately before application starts loading
    StatePlayerLoadEnd = "nx:state:player:load:end", /// immediately after application completes loading
    StateMediaLoadStart = "nx:state:media:load:start", /// On media request
    StateMediaStart = "nx:state:media:start", /// on video start
    StateMediaEnd = "nx:state:media:end", /// on media complete
    StateSessionEnd = "nx:state:session:end", /// on window unload

    SessionData = "nx:session:data", // when application session specific data
    SessionDataPerformance = "nx:session:data:performance", // dom performance timing
    // SessionDataUserAgent = "nx:session:data:useragent", // user agent
    SessionDataHardware = "nx:session:data:hardware", // system hardware

    MediaFullscreenOpen = "nx:player:fullscreen:open", // open fullscreen
    MediaFullscreenClose = "nx:player:fullscreen:close", // close fullscreen

    MediaData = "nx:media:data",// when media ends naturally
    MediaAdComplete = "nx:media:ad:complete",// when media ends naturally
    MediaAdEnd = "nx:media:ad:end",// set immediately at ad end
    MediaAdStart = "nx:media:ad:start",// set immediately at ad start
    MediaAdLoadStart = "nx:media:ad:load:start",// when media source is requested from resource
    MediaAdpodEnd = "nx:media:adpod:end",// set immediately at end of adpod
    MediaAdpodStart = "nx:media:adpod:start",// set immediately at start of adpod
    MediaAudioUpdate = "nx:media:audio:update",// when audiotracks updated
    MediaBitrateUpdate = "nx:media:bitrate:update",// when the bitrate changes
    MediaBufferEnd = "nx:media:buffer:end", // when buffering stops
    MediaBufferStart = "nx:media:buffer:start", // when buffering starts
    MediaCcUpdate = "nx:media:cc:update", // when cc updates
    MediaComplete = "nx:media:complete", // when media naturally completes
    MediaCuepoint = "nx:media:cuepoint", // on cuepoint reached
    MediaEnd = "nx:media:end",// when media ends for uknown reasons
    MediaError = "nx:media:error",  // an error occurred with media
    MediaPause = "nx:media:pause", // media pause
    MediaPlay = "nx:media:play", // play
    MediaAbort = "nx:media:abort",
    MediaEnded = "nx:media:ended",
    MediaLoadeddata = "nx:media:loadeddata",
    MediaLoadedmetadata = "nx:media:loadedmetadata",
    MediaLoadstart = "nx:media:loadstart",
    MediaBitrateChange = "nx:media:bitrate:change",
    MediaSeekEnd = "nx:media:seek:end",
    MediaSeekStart = "nx:media:seek:start",
    MediaSuspend = "nx:media:suspend",
    MediaVolumechange = "nx:media:volumechange",
    MediaMute = "vplayer:mute", // player muted
    MediaWaiting = "nx:media:waiting"
}
