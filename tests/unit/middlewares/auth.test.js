const auth = require('../../../src/middlewares/auth')
const { User } = require('../../../src/models/user')
const mongoose = require('mongoose')

describe('authorization middleware', () => {

  it('should populate req.user if token is provided', () => {
    const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
    const token = new User(user).generateAuthToken()
    const req = { header: jest.fn().mockReturnValue(token) }
    const res = {}
    const next = jest.fn()

    auth(req, res, next)

    expect(req.user).toMatchObject(user)
  })
})