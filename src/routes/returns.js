const express = require('express')
const router = express.Router()
const Joi = require('@hapi/joi')
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')
const authorize = require('../middlewares/auth')
const validate = require('../middlewares/validate')

router.post('/', [authorize, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
  if (!rental) return res.status(404).send('Rental dont exists')

  if (!!rental.dateReturned) res.status(400).send('This rental is already processed')

  await rental.return()
  await rental.save()

  await Movie.findByIdAndUpdate(rental.movie._id, { $inc: { numberInStock: 1 } })

  res.send(rental)
})

function validateReturn (returns) {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  })
  return schema.validate(returns)
}

module.exports = router