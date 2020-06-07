const express = require('express')
const router = express.Router()
const { Customer, validate } = require('../models/customer')
const validator = require('../middlewares/validate')

router.get('/', async (_req, res) => {
  const customers = await Customer.find().sort('name')
  if (!customers) return res.status(400).send('Bad request')

  res.send(customers)
})

router.post('/', validator(validate), async (req, res) => {

  let customer = new Customer(req.body)
  customer = await customer.save()

  res.send(customer)
})

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer) return res.status(404).send('The customer with the given ID was not found')

  res.send(customer)
})

router.put('/:id', validator(validate), async (req, res) => {

  let customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!customer) return res.status(404).send('The customer with the given ID was not found')

  res.send(customer)
})

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id)
  if (!customer) return res.status(404).send('The customer with the given ID was not found')

  res.send(customer)
})

module.exports = router