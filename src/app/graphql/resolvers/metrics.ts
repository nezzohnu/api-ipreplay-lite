import { authenticated } from "app/services/graphql"
import { filterLogs } from "app/services/amazon/cwlog"
import { pluck, flatten, reduce, add, keys, test, path } from 'ramda'
import * as mappings from '../../services/amazon/addons/marks'

import * as parse from 'url'

const statePattern = '{$.event = "*nx:state*"}'
const resourcePattern = '{$.event = "resource"}'
const domPattern = '{$.event = "nx:dom*"}'
const mediaPattern = '{$.event = "media:load:start"}'



const filter = (options, pattern) => Promise.resolve(filterLogs({ ...options, filterPattern: pattern }))

const checkDom = (fDoms, fUserAgents, state) => {

    const { event } = state.message
    if (!test(/^nx:dom:/, event)) { return { fDoms, fUserAgents } }

    if (test(/^nx:dom:useragent/, event)) {
        const ua = path(['message', 'payload', 'userAgent'], state)
        const name = ua.browser.name
        const vers = ua.browser.version
        if (!fUserAgents[name + vers]) {
            fUserAgents[name + vers] = { count: 0, browser: ua.browser, os: ua.os, engine: ua.engine }
        }
        fUserAgents[name + vers].count += 1
    }

    if (!fDoms[event]) {
        fDoms[event] = []
    }
    const { startTime } = state.message.timing

    if (startTime) { fDoms[event].push(startTime) }

    return { fDoms, fUserAgents }
}


const checkMedia = (fMedias, state) => {
    const { event } = state.message
    if (!test(/^media:load:start/, event)) { return fMedias }

    const media = path(['payload', 'baseClip'], state.message)
    const videoId = media.guid
    const title = media.title
    const description = media.description
    const duration = media.trueLength
    const isAd = media.isAd

    if (!fMedias[videoId]) {
        fMedias[videoId] = {
            count: 0, title, description, videoId,
            isAd,
            duration
        }
    }

    fMedias[videoId].count += 1

    return fMedias
}

const format = (states) => {
    let streams = {}
    let count = 0

    let fStates = { pageLoad: [], playerLoad: [], mediaError: [], mediaRequest: [], mediaComplete: [], mediaStart: [], unload: [] }
    let fHosts = {}
    let fResources = {}
    let fDoms = {}
    let fUserAgents = {}
    let fMedias = {}
    states.forEach(state => {
        if (!streams[state.logStreamName]) {
            count += 1
            streams[state.logStreamName] = []
        }

        state.message = JSON.parse(state.message)
        fMedias = checkMedia(fMedias, state)
        fStates = checkStates(fStates, state)
        let dom = checkDom(fDoms, fUserAgents, state)
        fDoms = dom.fDoms
        fUserAgents = dom.fUserAgents

        if (state.message.payload && state.message.payload.name) {
            let hostsAndRes = checkHostsAndResource(fHosts, fResources, state)
            fHosts = hostsAndRes.fHosts
            fResources = hostsAndRes.fResources
        }

        state.event = state.message.event

        streams[state.logStreamName].push(state)
    })

    return { streams, fStates, fHosts, fResources, fDoms, fUserAgents, fMedias }
}

const pageload = (pageload) => reduce(add, 0, pageload) / pageload.length

const networklatency = (resources) => {

    resources = keys(resources).map(key => {
        const resource = resources[key]
        const st = pluck('startTime', resource)
        const avest = reduce(add, 0, st) / st.length

        const dur = pluck('duration', resource)
        const avedur = reduce(add, 0, dur) / dur.length

        return { label: key, metric: JSON.stringify({ startTime: avest, latency: avedur }) }
    })

    return resources
};

export const metrics = authenticated(async (root: any, args: any, ctx: any) => {
    const { user } = ctx
    console.log(ctx)
    const options = buildOptions(args.input)

    const tmpMedias = flatten(await dowhilemore(filter, mediaPattern, options))
    let { fMedias } = format(tmpMedias)

    fMedias = keys(fMedias).map(key => fMedias[key])


    const tmpStates = flatten(await dowhilemore(filter, statePattern, options))
    const { fStates } = format(tmpStates)
    const avePageload = pageload(fStates.pageLoad)

    let tmpResources = flatten(await dowhilemore(filter, resourcePattern, options))
    let { fHosts, fResources } = format(tmpResources)
    const resResource = networklatency(fHosts)

    fResources = keys(fResources).map(key => ({ label: key, metric: JSON.stringify(fResources[key]) }))

    let tmpDoms = flatten(await dowhilemore(filter, domPattern, options))
    let { fDoms, fUserAgents } = format(tmpDoms)
    fDoms = keys(fDoms).map(key => ({ label: key, metric: JSON.stringify(fDoms[key]) }))
    fUserAgents = keys(fUserAgents).map(key => fUserAgents[key])



    let response = {
        networkLatency: resResource,
        states: { ...fStates },
        medias: fMedias,
        resourceLatency: fResources,
        userAgents: fUserAgents,
        doms: fDoms,
        avePageload,
        namespace: user.namespace,
        total: resResource.length,
        lastKey: null
    }

    return response
})


const buildOptions = (input) => {
    const { limit, type, byVideoId, lastKey, startTime, endTime, nextToken } = input

    return { limit, type, byVideoId, lastKey, startTime, endTime, nextToken }
}

const checkStates = (o, state) => {
    const startTime = state.message.timing.startTime

    const message = state.message.event
    if (message === mappings.MARK.StateSessionStart) {
        o.pageLoad.push(startTime)
    }

    if (message === mappings.MARK.StatePlayerLoadEnd) {
        o.playerLoad.push(startTime)
    }

    if (message === mappings.MARK.StateMediaLoadStart) {
        o.mediaRequest.push(startTime)
    }

    if (message === mappings.MARK.StateMediaEnd) {
        o.mediaComplete.push(startTime)
    }

    if (message === mappings.MARK.StateMediaStart) {
        o.mediaStart.push(startTime)
    }

    if (message === mappings.MARK.StateSessionEnd) {
        o.unload.push(startTime)
    }

    return o
}

const checkHostsAndResource = (fHosts, fResources, state) => {
    try {
        const url = new parse.URL(state.message.payload.name)
        const pathname = url.pathname.split('/').pop()

        if (!fHosts[url.host]) { fHosts[url.host] = [] }

        if (!fResources[pathname]) { fResources[pathname] = [] }

        const { startTime, duration } = state.message.payload

        fHosts[url.host].push({ startTime, duration })
        fResources[pathname].push({ startTime, duration })

    } catch (err) {
        console.log(state.message.payload.name)
        console.log(err.message)
    }
    return { fHosts, fResources }
}


const dowhilemore = async (func, pattern, options) => {
    let count = 0
    let hasmore = true
    let temp = []

    do {

        const tmp = await func(options, pattern)
        temp.push(tmp)
        if (tmp.nextToken) {
            options.nextToken = tmp.nextToken
        } else {
            hasmore = false
            break;
        }
        if (count > 10) {
            hasmore = false
            break;
        }
        count += 1

    } while (hasmore)

    return Promise.resolve(pluck('events', temp))
}