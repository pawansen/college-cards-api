const Winston = require('winston'),
  DailyRotateFile = require('winston-daily-rotate-file'),
  morgan = require('morgan'),
  morganJson = require('morgan-json'),
  { env } = require('../../infrastructure/env'),
  getCurrentLine = require('get-current-line'),
  { getExecutionTimeDetails } = require('../utils/utility'),
  { calculateExecutionTime } = getExecutionTimeDetails(),
  currentMethodName = getCurrentLine.default().method,
  { combine, timestamp, printf, colorize, align, json, errors } =
    Winston.format,
  date = new Date()

// Get year, month, and day part from the date
let formattedDate =
  date.toLocaleString('default', { year: 'numeric' }) +
  '-' +
  date.toLocaleString('default', { month: '2-digit' }) +
  '-' +
  date.toLocaleString('default', { day: '2-digit' })

/** http request formate for logging */
const format = morganJson({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time',
})

/*const activityFile = Winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A', tz: 'Asia/Kolkata'
    }),
    json(),
    errors({ stack: true })
  ),
  transports: [
    new Winston.transports.File({
      filename: `logs/activity/application-${formattedDate}.log`,
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
})*/

/*exports.httpLogger = morgan(
  format,
  env.ACTIVITY_ENABLE_LOGS == 1
    ? {
      stream: {
        write: (message) => {
          const { method, url, status, contentLength, responseTime } =
            JSON.parse(message)
          activityFile.info('HTTP Access Log', {
            timestamp: new Date().toString(),
            method,
            url,
            status: Number(status),
            contentLength,
            responseTime: Number(responseTime),
          })
        },
      },
    }
    : false
)*/

/**
 *
 * logger function diaplay logs
 *
 * */
exports.loggerNew = Winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      tz: 'Asia/Kolkata',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new Winston.transports.Console()],
})

const infoFilter = Winston.format((info, opts) => {
  return info.level === 'info' ? info : false
})

/**
 *
 * create logger file
 *
 *  */

let transports = [
  new Winston.transports.File({
    filename: `logs/info-${formattedDate}.log`,
    level: 'info',
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '7d',
  }),
  new Winston.transports.File({
    filename: `logs/error-${formattedDate}.log`,
    level: 'error',
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '7d',
  }),
]

if (env.ACTIVITY_ENABLE_LOGS == 0) {
  trasn = [new Winston.transports.Console({ level: 'error' })]
}

exports.logger = Winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'DD-MM-YYYY hh:mm:ss.SSS A', tz: 'Asia/Kolkata' }),
    printf((info) => {
      return (
        info.timestamp +
        ' ' +
        JSON.stringify({
          action: info.action || '',
          route: info.url || '',
          message: info.message,
          executionTime: info.executionTime + 'ms' || '0',
          callingFile: info.callingFileName ? info.callingFileName : '',
          callingFunction: info.callingFunction ? info.callingFunction : '',
          currentLine: info.currentLine || '0',
          userId: info.userId ? info.userId : '',
          userName: info.userName ? info.userName : '',
          level: info.level,
          method: info.method ? info.method : '',
        })
      )
    })
  ),
  transports: transports,
})

let alignColorsAndTime = Winston.format.combine(
  Winston.format.colorize({
    all: true,
  }),
  Winston.format.printf((info) => `${info.level} : ${info.message}`)
)

exports.log = Winston.createLogger({
  level: 'debug',
  transports: [
    new Winston.transports.Console({
      format: Winston.format.combine(
        Winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
  ],
  exitOnError: false,
})
