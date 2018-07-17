import * as os from 'os'
import * as restify from 'restify'
import * as CookieParser from 'restify-cookies'
import { buildCors } from 'app/middlewares/cors'

const cors = buildCors()

export default (server: any) => {

  server.pre(restify.pre.sanitizePath())

  // NOTE prevent ddos
  server.use(function slowHandler(req, res, next) {
    setTimeout(() => { return next() }, 250);
  })

  // server.use(CookieMiddleware.preroute)

  server.pre(cors.preflight)
  server.use(cors.actual)

  server.pre((req: restify.Request, res, next) => {
    req.connection['proxySecure'] = (req.header('x-forwarded-proto') === "https" ? true : false)
    req.log.info({ req: req }, 'Incoming Request')
    next()
  })

  // server.use(HeaderMiddleware.exec)
  server.use(restify.plugins.acceptParser(server.acceptable))
  server.use(restify.plugins.queryParser())
  server.use(restify.plugins.bodyParser({
    mapParams: true,
    uploadDir: os.tmpdir(),
    multiples: true
  }))

  server.use((req, res, next) => {
    res.redirect = function (addr) {
      res.header('Location', addr)
      res.send(302)
    }
    next()
  })

  server.use(CookieParser.parse)
}
