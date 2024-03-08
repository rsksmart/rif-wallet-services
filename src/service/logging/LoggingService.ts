import winston from 'winston'
const { combine, timestamp, json, errors } = winston.format

export const createLogger = () => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), timestamp(), json()),
    transports: [new winston.transports.Console()]
  })
}
