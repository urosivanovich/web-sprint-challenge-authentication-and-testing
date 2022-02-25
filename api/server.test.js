const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('POST /api/auth/register', () => {
  test('returns an error if username/password is missing or already in use',  async () => {
    const res = await request(server).post('/api/auth/register')
    expect(res.body.message).toMatch(/username and password required/i)
    await request(server).post('/api/auth/register').send({username: 'lou', password:'1234'})
    const newUser = await request(server).post('/api/auth/register').send({username: 'lou', password:'1234'})
    expect(newUser.body.message).toMatch(/username taken/i)
  })
  test('returns an username if successfully registered', async () => {
    const res = await request(server).post('/api/auth/register').send({username: 'bugsy', password:'1234'})
    expect(res.body.username).toBe('bugsy')
    expect(res.body).toBeInstanceOf(Object)
  })
})

describe('POST /api/auth/login', () => {
  test('returns an error if username/password is missing or invalid', async () => {
    const res = await request(server).post('/api/auth/login')
    expect(res.body.message).toMatch(/username and password required/i)
    await request(server).post('/api/auth/register').send({username: 'lou', password: '1234'})
    let user = await request(server).post('/api/auth/login').send({username: 'lou', password: '122'})
    expect(user.body.message).toMatch(/invalid credentials/i)
  })
  test('returns welcome message if successfully logged in', async () => {
    await request(server).post('/api/auth/register').send({username: 'lou', password: '1234'})
    const res = await request(server).post('/api/auth/login').send({username: 'lou', password: '1234'})
    expect(res.body.message).toMatch('welcome')
  })
})


describe('GET /api/jokes', () => {
  test('returns a status 401 if user not logged in', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/token required/i)
  })
  test('returns a status 200 if user is logged in', async () => {
    await request(server).post('/api/auth/register').send({username: 'lou', password: '1234'})
    let logged = await request(server).post('/api/auth/login').send({username: 'lou', password: '1234'})
    logged = await request(server).get('/api/jokes').set('Authorization', logged.body.token)
    expect(logged.status).toBe(200)
    expect(logged.body).toHaveLength(3)
  })
})