import server from 'config/app'
import { logger } from 'app/services/logger'

// NOTE connect db and then allow api connections
process.send = process.send || function () { }

server.listen(8080, function () {
  logger.info('%s listening at %s', server.name, server.url)
  process.send('ready')
})

process.on('message', function (msg) {
  if (msg == 'shutdown') {
    setTimeout(function () {
      logger.error('Process Shutdown Signal')
      process.exit(0)
    }, 1500)
  }
})
