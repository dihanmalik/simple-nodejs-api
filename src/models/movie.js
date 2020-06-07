const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const { genreSchema } = require('./genre')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    max: 255,
    min: 0
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255
  }
})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie (movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  })

  return schema.validate(movie)
}

module.exports = { Movie, validateMovie, movieSchema }