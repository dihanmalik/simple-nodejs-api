const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const moment = require('moment')
const { customerSchema } = require('./customer')
const { genreSchema } = require('./genre')

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
      },
      dailyRentalRate: { type: Number, default: 0 },
      genre: genreSchema
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
})

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'movie._id': movieId,
    'customer._id': customerId
  })
}

rentalSchema.methods.return = function () {
  this.dateReturned = new Date()

  const rentalDays = moment().diff(this.dateOut, 'days')
  this.rentalFee = rentalDays * this.movie.dailyRentalRate
}

const Rental = mongoose.model('Rental', rentalSchema)


function validateRental (rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })
  return schema.validate(rental)
}

module.exports = { Rental, validateRental }