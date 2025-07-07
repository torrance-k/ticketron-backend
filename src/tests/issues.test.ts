import request from 'supertest'
import app from '../app'
import { connectTestDB, closeTestDB, clearTestDB } from '../tests/setupTestDB'
import { createTestUserAndToken } from '../tests/authTestUtils'
import Project from '../models/Project'


let token: string
let userId: string

beforeAll(async () => {
  await connectTestDB()
})

afterEach(async () => {
  await clearTestDB()
})

afterAll(async () => {
  await closeTestDB()
})

beforeEach(async () => {
  const { user, token: userToken } = await createTestUserAndToken()
  token = userToken
  userId = user._id.toString()
})

describe('Issues API', () => {
    it('should create an issue for a project', async () => {
      // Create a project first
      const project = await Project.create({
        name: 'Test Project',
        owner: userId,
        members: [userId],
      })
  
      const res = await request(app)
        .post(`/api/issues/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Fix login bug',
          description: 'User cannot login with correct password.',
          assignee: userId,
          createdBy: userId,
        })
  
      expect(res.statusCode).toBe(201)
      expect(res.body.title).toBe('Fix login bug')
      expect(res.body.project).toBe(project._id.toString())
    })
  })
  