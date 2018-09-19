import "../../../support/hooks"
import * as data from '../../../config/sessions.data'

declare const expect, it, describe, factory, after, before, execGraphql

const action = "metricsLatency"
const mutation = `
mutation createPixelsJob($input: CreatePixelsInput!) {
    createPixelsJob(input: $input) {
      namespace
      lastKey
      logStreamName
    }
  }
`
const deleteMutation = `
mutation deleteSessions($input: DeleteSessionsInput!){
	deleteSessions(input:$input){
		value
	}
}
`
const query = `query {		
	metricsMedia{
		data{
			total
			streamsSearched
			id
			label
			data{
				payload
				video{currentTime videoId duration}
				logStreamName
			}
		}
		collections
		lastKey
	}
}`

const sessions = data.sessions;
const session_mlsf = data.session_mlsf;
const session_msf_plf_sr = data.session_msf_plf_sr;
const session_mpc_mra_pla_mep = data.session_mpc_mra_pla_mep;



describe(__filename, async () => {
    let res
    let logStreamNames = []

    before(async () => {
        let user = await factory.create("user")
        let pixel1 = await execGraphql({
            query: mutation, variableValues: {
                input: { pixels: sessions, meta: { state: "init", timestamp: +new Date() } }
            }, user
        })

        let pixel2 = await execGraphql({
            query: mutation, variableValues: {
                input: { pixels: session_mlsf, meta: { state: "init", timestamp: +new Date() } }
            }, user
        })

        let pixel3 = await execGraphql({
            query: mutation, variableValues: {
                input: { pixels: session_msf_plf_sr, meta: { state: "init", timestamp: +new Date() } }
            }, user
        })
        let pixel4 = await execGraphql({
            query: mutation, variableValues: {
                input: { pixels: session_mpc_mra_pla_mep, meta: { state: "init", timestamp: +new Date() } }
            }, user
        })
        await delay()
        logStreamNames = [
            pixel1.data.createPixelsJob.logStreamName,
            pixel2.data.createPixelsJob.logStreamName,
            pixel3.data.createPixelsJob.logStreamName,
            pixel4.data.createPixelsJob.logStreamName

        ]
    })

    after(async () => {
        let user = await factory.create("user")
        await execGraphql({
            query: deleteMutation, variableValues: {
                input: { logStreamNames: logStreamNames }
            }, user
        })
    })

    describe('query metricsMedia', () => {

        before(async () => {
            let user = await factory.create("user")

            res = await execGraphql({ query, variableValues: { startTime: +new Date() - 1000 * 30 }, user })
        })

        it(`should return Media Start Failure`, async () => {
            const attr = { id: 'media:start:failure', label: 'Media Start Failure' }
            expect(res.data.metricsMedia.data).to.containSubset([attr])
        })

        it(`should return Player Load Failure`, async () => {
            const attr = { id: 'player:load:failure', label: 'Player Load Failure' }
            expect(res.data.metricsMedia.data).to.containSubset([attr])
        })

        it(`should return Media Playback Complete`, async () => {
            const attr = { id: 'media:playback:complete', label: 'Media Playback Complete' }
            expect(res.data.metricsMedia.data).to.containSubset([attr])
        })

        it(`should return Media Request Attempts`, async () => {
            const attr = { id: 'media:request:attempts', label: 'Media Request Attempts' }
            expect(res.data.metricsMedia.data).to.containSubset([attr])
        })

        it(`should return Player Load Attempts`, async () => {
            const attr = { id: 'player:load:attempts', label: 'Player Load Attempts', }
            expect(res.data.metricsMedia.data).to.containSubset([attr])
        })

        it(`should return Media Ended Plays`, async () => {
            const attr = { id: 'media:ended:plays', label: 'Media Ended Plays' }
            expect(res.data.metricsMedia.data).to.containSubset([attr])
        })

    })

})

