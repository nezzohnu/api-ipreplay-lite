import * as bunyan from "bunyan"
import settings from "config/settings"

const mockLogger = {
  debug: (value?: string, value2?: string, value3?: string) => {},
  info: (value?: string, value2?: string, value3?: string) => {},
  error: (value?: string, value2?: string, value3?: string) => {},
  warn: (value?: string, value2?: string, value3?: string) => {},
  trace: (value?: string, value2?: string, value3?: string) => {},
}

const buildLoggerJob = (): any => {
  if (settings.isEnvTest) { return mockLogger }
  if (settings.use_amazon_serverless) { return console }

  return bunyan.createLogger({
      name: 'Video Intellisense Platform API JOB',
      serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
      },
      streams: [
        {
          stream: process.stdout,
          level: 'debug'
        },
        {
          path: 'logs/job.log',
          level: 'trace'
        }
      ],
  })
}

const buildLogger = (): any => {
  if (settings.isEnvTest) { return mockLogger }
  if (settings.use_amazon_serverless) { return console }

  return bunyan.createLogger({
      name: 'Video Intellisense Platform API',
      serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
      },
      streams: [
        {
          stream: process.stdout,
          level: 'debug'
        },
        {
          path: 'logs/service.log',
          level: 'trace'
        }
      ],
  })
}

const logger: any = buildLogger()
const loggerJob: any = buildLoggerJob()

export {
  logger,
  loggerJob,
}

export default logger
