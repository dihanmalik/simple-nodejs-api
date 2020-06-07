const express = require('express')
const router = express.Router()
const Transaction = require('mongoose-transactions')
const { Rental, validateRental } = require('../models/rental')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')
const { dbDebugger } = require('../debugger')
const validator = require('../middlewares/validate')

const transaction = new Transaction()

router.get('/', async (req, res) => {
  const rentals = await Rental.find()
  if (!rentals) return res.status(400).send('Something went wrong!')
  res.send(rentals)
})

router.post('/', validator(validateRental), async (req, res) => {

  const customer = await Customer.findById(req.body.customerId).select('-__v')
  if (!customer) return res.status(404).send(`The customer with the given ID was not found`)

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(404).send(`The movie with the given ID was not found`)
  if (movie.numberInStock === 0) return res.status(400).send(`The movie ${movie.title} is out of stock.`)

  let rental = new Rental({
    customer,
    movie
  })

  movie.numberInStock--
  await transaction.update('Movie', movie.id, movie, { new: true })
  await transaction.insert('Rental', rental)

  try {
    const [updatedMovie, savedRental] = await transaction.run()
    res.send(savedRental)
  } catch (e) {
    await transaction.rollback().catch(e => dbDebugger('rollback error: ', e))
    res.status(400).send('Something wen wrong!')
  } finally {
    await transaction.clean()
  }

})

module.exports = router