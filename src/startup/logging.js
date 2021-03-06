const winston = require('winston')

if (process.env.NODE_ENV === 'development') {
  require('winston-mongodb')
}

require('express-async-errors')

module.exports = function () {

  winston.exceptions.handle(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
      )
    }),
    new winston.transports.File({
      filename: 'uncaughtExceptions.log',
      format: winston.format.json({ space: 2 })
    })
  )

  process.on('unhandledRejection', (ex) => {
    throw ex
  })

  winston.add(new winston.transports.File({
    filename: 'error.log',
    format: winston.format.json({ space: 2 }),
    level: 'error'
  }))

  if (process.env.NODE_ENV === 'test') {
    winston.add(new winston.transports.Console({
      format: winston.formast.colorize({ all: true })
    }))
  }

  // if (process.env.NODE_ENV === 'development') {
  //   winston.add(new winston.transports.MongoDB({
  //     db: process.env.DB,
  //     level: 'error',
  //     tryReconnect: true
  //   }))
  // }
}