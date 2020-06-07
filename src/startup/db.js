const winston = require('winston')
const mongoose = require('mongoose')

module.exports = function () {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(process.env.DB)
    .then(() => winston.info('Connected to MONGODB...'))
}