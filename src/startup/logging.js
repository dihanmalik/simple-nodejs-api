const winston = require('winston')

if (process.env.NODE_ENV === 'production') {
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
      format: winston.format.colorize({ all: true })
    }))
  }

  if (process.env.NODE_ENV === 'production') {
    winston.add(new winston.transports.MongoDB({
      db: 'mongodb://localhost/vidly',
      level: 'error'
    }))
  }
}