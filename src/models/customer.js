const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: {
    type: String,
    minlength: 3,
    maxlength: 25,
    required: true
  },
  phone: String
})

const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer (customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    isGold: Joi.bool(),
    phone: Joi.string().required()
  })

  return schema.validate(customer)
}


module.exports = { Customer, validate: validateCustomer, customerSchema }