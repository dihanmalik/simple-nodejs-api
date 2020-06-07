const request = require('supertest')
const { Genre } = require('../../src/models/genre')
const { User } = require('../../src/models/user')
const mongoose = require('mongoose')
let server

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../src/index') })
  afterEach(async () => {
    server.close()
    await Genre.deleteMany({})
  })

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' }
      ])

      const result = await request(server).get('/api/genres')

      expect(result.status).toBe(200)
      expect(result.body.length).toBe(2)
      expect(result.body.some(a => a.name === 'genre1')).toBeTruthy()
      expect(result.body.some(a => a.name === 'genre2')).toBeTruthy()
    })
  })

  describe('GET /:id', () => {
    it('should return genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' })
      await genre.save()

      const result = await request(server).get('/api/genres/' + genre._id)
      expect(result.body).toHaveProperty('name', genre.name)
    })
  })

  describe('GET /:id', () => {
    it('should return 400 when genre id is invalid', async () => {

      const result = await request(server).get('/api/genres/1')
      expect(result.status).toBe(400)
    })

    it('should return 404 when valid genre id is dont exists', async () => {
      const id = new mongoose.Types.ObjectId()
      const result = await request(server).get('/api/genres/' + id)
      expect(result.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let token
    let name

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken()
      name = 'genre1'
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''
      const result = await request(server).post('/api/genres').send({ name: 'genre1' })
      expect(result.status).toBe(401)
    })

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234'
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if genre is more than 50 characters', async () => {
      name = Array(52).join('a')
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should should save the genre if it is valid', async () => {

      await exec()

      const genre = await Genre.find({ name: 'genre1' })

      expect(genre).not.toBeNull()
    })

    it('should should return the genre if it is valid', async () => {

      const result = await exec()

      expect(result.body).toHaveProperty('_id')
      expect(result.body).toHaveProperty('name', 'genre1')
    })
  })


  describe('PUT /:id', () => {
    let token
    let objectId
    let name

    const exec = () => {
      return request(server)
        .put('/api/genres/' + objectId)
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(() => {
      name = 'genre1234'
      token = new User().generateAuthToken()
      objectId = mongoose.Types.ObjectId().toHexString()
    })

    it('should return 400 when id is invalid', async () => {
      objectId = '1'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 when validation not passed', async () => {
      name = '1234'
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 404 when the given genre id not exists', async () => {
      //populate db
      const genre = new Genre({ name: 'genre1' })
      await genre.save()
      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return updated genre when valid id exists', async () => {
      //populate db
      const genre = new Genre({ name: 'genre1' })
      await genre.save()

      objectId = genre._id.toHexString()
      name = 'udpate genre name'
      const res = await exec()

      expect(res.body).toMatchObject({ _id: objectId, name })
    })
  })

  describe('DELETE /:id', () => {
    let objectId
    let token

    const exec = () => {
      return request(server)
        .delete('/api/genres/' + objectId)
        .set('x-auth-token', token)
    }

    beforeEach(() => {
      objectId = mongoose.Types.ObjectId()
      token = new User().generateAuthToken()
    })

    it('should return 401 when no token provided', async () => {
      token = ''
      objectId = '1'
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if token is provided but invalid', async () => {
      token = '1'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 404 if given id is dont exists', async () => {
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should return the deleted genre if id exists', async () => {
      //populate genre
      const genre = new Genre({ name: 'genre1' })
      await genre.save()

      objectId = genre._id

      const res = await exec()
      expect(res.body).toMatchObject({ _id: genre._id.toHexString(), name: 'genre1' })
    })
  })
})