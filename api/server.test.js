const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const User = require('../api/users/users-model')
const GabeN = { username: 'God', password: 'awp' }
const toddHoward = { username: 'sucky', password: 'notawp' }
const bcrypt = require('bcryptjs')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})


describe("auth end points are working as intended", () => {
  it('[POST] /api/auth/register works', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: "deskpuncher", password: 'toot' })
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('deskpuncher')
  })

  it('[POST] /api/auth/register', async () => {
    const res = await request(server).post('/api/auth/register').send({ usernam: "send_name", password: 'toot' })
    expect(res.status).toBe(404)
  })

  it('[POST] /api/auth/login', async () => {
    const GabeN = { username: 'God', password: 'awp' }
    const GabeN1 = { username: 'God', password: 'awp' }
    const hash = bcrypt.hashSync(GabeN.password, 7)
    GabeN.password = hash
    await User.add(GabeN)
    const response = await request(server).post('/api/auth/login').send(GabeN1)
    expect(response.status).toBe(200)


  })
  it('[POST] /api/auth/login doesnot work', async () => {
    const GabeN = { username: 'God', password: 'awp' }
    const GabeN1 = { username: 'God', password: 'dawp' }
    const response = await request(server).post('/api/auth/login').send(GabeN)
    expect(response.status).toBe(401)
  })

})