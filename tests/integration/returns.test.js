const request = require('supertest')
const mongoose = require('mongoose')
const moment = require('moment')
const { Rental } = require('../../src/models/rental')
const { Movie } = require('../../src/models/movie')
const { User } = require('../../src/models/user')


describe('/api/returns', () => {
  let server

  beforeEach(async () => {
    server = require('../../src/index')
  })

  afterEach(async () => {
    server.close()
  })

  describe('POST /', () => {
    let rental
    let movie
    let customerId
    let movieId
    let token

    beforeEach(async () => {
      customerId = mongoose.Types.ObjectId()
      movieId = mongoose.Types.ObjectId()

      movie = new Movie({
        _id: movieId,
        title: 'movie1',
        genre: { name: 'genre1' },
        dailyRentalRate: 2,
        numberInStock: 10
      })

      await movie.save()

      rental = new Rental({
        movie: {
          _id: movieId,
          title: 'movie1',
          dailyRentalRate: 2
        },
        customer: {
          _id: customerId,
          name: 'customer one',
          phone: '234234'
        }
      })

      await rental.save()
    })

    afterEach(async () => {
      await Rental.deleteMany({})
      await Movie.deleteMany({})
    })

    const exec = () => {
      return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId })
    }

    beforeEach(() => {
      dateReturned = Date.now()
      token = new User().generateAuthToken()
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''
      const result = await exec()
      expect(result.status).toBe(401)
    })

    it('should return 400 if customerId is not specified', async () => {
      customerId = ''
      const result = await exec()
      expect(result.status).toBe(400)
    })

    it('should return 400 if movieId is not specified', async () => {
      movieId = ''
      const result = await exec()
      expect(result.status).toBe(400)
    })

    it('should return 404 if no rental found for customer/movie', async () => {
      customerId = mongoose.Types.ObjectId()
      movieId = mongoose.Types.ObjectId()
      const result = await exec()
      expect(result.status).toBe(404)
    })

    it('should return 400 if rental is already processed', async () => {
      rental.dateReturned = new Date()
      await rental.save()

      const result = await exec()
      expect(result.status).toBe(400)
    })

    it('should return 200 if rental is valid', async () => {
      const result = await exec()
      expect(result.status).toBe(200)
    })

    it('should set the return date if input is valid', async () => {
      rental.dateReturned = new Date()
      await rental.save()
      await exec()
      const rentalInDB = await Rental.findById(rental._id)
      expect(rentalInDB.dateReturned).toBeDefined()
    })

    it('should set the rental fee if input is valid', async () => {
      rental.dateOut = moment().add(-7, 'days').toDate()
      await rental.save()
      await exec()

      const rentalInDB = await Rental.findById(rental._id)

      expect(rentalInDB.rentalFee).toBe(14)
    })

    it('should increase the stock of movie if input is valid', async () => {
      await exec()
      const movieInDB = await Movie.findById(movieId)

      expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1)
    })

    it('should return the rental if input is valid', async () => {
      const result = await exec()

      expect(Object.keys(result.body)).toEqual(
        expect.arrayContaining(['rentalFee', 'dateOut', 'dateReturned', 'movie', 'customer'])
      )
    })

  })
})