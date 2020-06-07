const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { User, validateUser } = require('../models/user')
const { pick } = require('ramda')
const authorize = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validator = require('../middlewares/validate')

router.get('/me', authorize, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  if (!user) return res.status(400).send('Something went wrong while fetching your proifle')
  res.send(user)
})

router.post('/', [authorize, admin, validator(validateUser)], async (req, res) => {

  let user = await User.findOne({ email: req.body.email })
  if (!!user) return res.status(400).send('User is already exists!')

  user = new User(pick(['name', 'email', 'password', 'isAdmin'])(req.body))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  res.send(pick(['name', 'email'])(user))
})

module.exports = router