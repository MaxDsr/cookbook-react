import winston from 'winston'

winston.configure({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: process.env.API_LOG_FILENAME })]
})
