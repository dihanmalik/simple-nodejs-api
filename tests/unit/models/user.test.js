
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { User } = require('../../../src/models/user')

describe('user.generateAuthToken', () => {
  test('should generate a valid JWT', () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true }
    const user = new User(payload)
    const token = user.generateAuthToken()

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
    expect(decoded).toMatchObject(payload)
  })
})