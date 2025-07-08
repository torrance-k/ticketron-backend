import request from 'supertest'
import app from '../app'
import { connectTestDB, closeTestDB, clearTestDB } from '../tests/setupTestDB'
import { createTestUserAndToken } from '../tests/authTestUtils'
import Project from '../models/Project'


let token: string
let userId: string
let project: any

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

  // Create a project first
  project = await Project.create({
    name: 'Test Project',
    owner: userId,
    members: [userId],
  })
})

describe('Issues API', () => {
    it('should create an issue for a project when given a token', async () => {
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

    it('should fail to create an issue without a token', async () => {
        const res = await request(app)
          .post(`/api/issues/project/${project._id}`)
          .send({
            title: 'Update Landing Page',
            description: 'Landing page title has a typo.',
            assignee: userId,
            createdBy: userId,
          })
    
        expect(res.statusCode).toBe(401)
      })

    it('should get all issues', async () => {
        let issueTitles = ['Fix login bug', 'Update Landing Page']
        await request(app)
            .post(`/api/issues/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: issueTitles[0],
                description: 'User cannot login with correct password.',
                assignee: userId,
                createdBy: userId,
            })
        await request(app)
            .post(`/api/issues/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: issueTitles[1],
                description: 'Landing page title has a typo.',
                assignee: userId,
                createdBy: userId,
            })
        let res = await request(app)
            .get(`/api/issues/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        let newIssueTitles = res.body.map((issue: {title: string }) => issue.title)

        expect(res.statusCode).toBe(200)
        expect(newIssueTitles).toEqual(issueTitles)
    })

    it('should get issue by id', async () => {
        const res = await request(app)
          .post(`/api/issues/project/${project._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Update Landing Page',
            description: 'Landing page title has a typo.',
            assignee: userId,
            createdBy: userId,
          })
        let projId = res.body._id

        const getProj = await request(app).get(`/api/issues/${projId}`).set('Authorization', `Bearer ${token}`)

        expect(getProj.body._id).toBe(projId)
    })

    it('should update an issue', async () => {
        const issueDescription = 'Landing page title has a typo.'
        const res = await request(app)
          .post(`/api/issues/project/${project._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Update Landing Page',
            description: issueDescription,
            assignee: userId,
            createdBy: userId,
          })

        const updatedDescription = 'Landing page typo: Welcme!'
        
        const updateRes = await request(app)
          .put(`/api/issues/${res.body._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: updatedDescription
          })

        expect(updateRes.body.description).toBe(updatedDescription)
    })

    it('should delete an issue', async () => {
        const issueDescription = 'Landing page title has a typo.'
        const res = await request(app)
          .post(`/api/issues/project/${project._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Update Landing Page',
            description: issueDescription,
            assignee: userId,
            createdBy: userId,
          })

        expect(res.statusCode).toBe(201)
        expect(res.body.description).toEqual(issueDescription)

        await request(app)
          .delete(`/api/issues/${res.body._id}`)
          .set('Authorization', `Bearer ${token}`)

        let allProjs = await request(app)
            .get(`/api/issues/project/${project._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(allProjs.body).toEqual([])
    })
  })
  