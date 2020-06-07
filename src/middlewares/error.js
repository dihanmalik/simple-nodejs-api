const winston = require('winston')

module.exports = function (err, _req, res, next) {
  winston.error(err.message, { metadata: err })
  res.status(500).send('Something failed')
  next(err)
}