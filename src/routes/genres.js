
const express = require('express')
const router = express.Router()
const { Genre, validate } = require('../models/genre')
const authorize = require('../middlewares/auth')
const validateObjectId = require('../middlewares/validateObjectId')
const validator = require('../middlewares/validate')

router.get('/', async (req, res) => {
  const result = await Genre.find().select('name')
  if (!result) return res.status(400).send('Bad request!')

  res.send(result)
})

router.post('/', [authorize, validator(validate)], async (req, res) => {

  let newGenre = new Genre(req.body)
  newGenre = await newGenre.save()

  res.send(newGenre)
})

router.put('/:id', [validateObjectId, validator(validate)], async (req, res) => {

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })

  if (!genre) return res.status(404).send('The genre with the given ID was not found')

  res.send(genre)
})

router.delete('/:id', [authorize, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id)
  if (!genre) return res.status(404).send('The genre with the given ID was not found')

  res.send(genre)
})

router.get('/:id', validateObjectId, async (req, res) => {

  const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).send('The genre with the given ID was not found')

  res.send(genre)
})

module.exports = router