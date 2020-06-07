const winston = require('winston')
const mongoose = require('mongoose')

module.exports = function () {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => winston.info('Connected to MONGODB...'))
}