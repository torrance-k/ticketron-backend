import request from 'supertest'
import app from '../app'
import { connectTestDB, closeTestDB, clearTestDB } from '../tests/setupTestDB'

beforeAll(async () => {
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
})

afterAll(async () => {
  await closeTestDB()
})

describe('Auth Routes', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpass',
  }

  it('should register a new user and return a token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)

    expect(res.statusCode).toBe(201)
    expect(res.body.user.email).toBe(testUser.email)
    expect(res.body.token).toBeDefined()
    expect(res.body.user).toHaveProperty('_id')
  })

  it('should fail to register the same user twice', async () => {
    await request(app).post('/api/auth/register').send(testUser)

    const res = await request(app).post('/api/auth/register').send(testUser)

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/already exists/i)
  })

  it('should login with valid credentials and return a token', async () => {
    // First register
    await request(app).post('/api/auth/register').send(testUser)

    // Then login
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.user.email).toBe(testUser.email)
    expect(res.body.token).toBeDefined()
  })

  it('should not login with incorrect password', async () => {
    await request(app).post('/api/auth/register').send(testUser)

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpass',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/invalid credentials/i)
  })

  it('should not login with unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'notfound@example.com',
      password: 'anyPassword',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/invalid credentials/i)
  })
})
