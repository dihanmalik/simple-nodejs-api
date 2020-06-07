const express = require('express')
const router = express.Router()
const { Movie, validateMovie } = require('../models/movie')
const { Genre } = require('../models/genre')
const validator = require('../middlewares/validate')

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title')
  if (!movies) return res.status(400).send('Something went wrong while fetching your movies')

  res.send(movies)
})

router.post('/', validator(validateMovie), async (req, res) => {

  const genre = await Genre.findById(req.body.genreId).select('name')
  if (!genre) return res.status(404).send('Invalid genre.')

  const newMovie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  })
  await newMovie.save()

  res.send(newMovie)
})

module.exports = router