const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')

const userSchmea = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxLength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxLength: 1024
  },
  isAdmin: Boolean
})

userSchmea.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.PRIVATE_KEY)
}

const User = mongoose.model('User', userSchmea)

function validateUser (user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.complexPassword().min(5).max(255).required()
  })
  return schema.validate(user)
}

module.exports = { User, validateUser }