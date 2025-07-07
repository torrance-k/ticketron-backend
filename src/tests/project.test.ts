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

describe('Projects API', () => {
  let token: string

  beforeEach(async () => {
    // Register a user and get a token
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass',
    })
    token = res.body.token
  })

  it('should create a project when authenticated', async () => {
    const project = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project' })

    expect(project.statusCode).toBe(201)
    expect(project.body.name).toBe('Test Project')
  })

  it('should fail to create a project without a token', async () => {
    const unauthenticatedProject = await request(app)
      .post('/api/projects')
      .send({ name: 'Unauthorized Project' })

    expect(unauthenticatedProject.statusCode).toBe(401)
  })

  it('should get all existing projects', async () => {
    const expectedProjectNames = ['Test Project 1', 'Test Project 2', 'Test Project31']
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: expectedProjectNames[0] })
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: expectedProjectNames[1] })
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: expectedProjectNames[2] })

    const allProjects = await request(app).get('/api/projects').set('Authorization', `Bearer ${token}`)
    
    const projectNames = allProjects.body.map((proj: { name: string }) => proj.name)

    expect(allProjects.statusCode).toBe(200)
    expect(projectNames).toEqual(expectedProjectNames)
  })

  it('should get a project by id', async () => {
    const project = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Project' })

    const expectedProjectId = project.body._id
    const expectedProjectName = project.body.name

    const newProj = await request(app)
        .get(`/api/projects/${expectedProjectId}`)
        .set('Authorization', `Bearer ${token}`)

    expect(newProj.statusCode).toBe(200)
    expect(newProj.body.name).toEqual(expectedProjectName)
  })

  it('should change projects name', async () => {
    const project = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Project' })

    const newName = 'Test Project Updated'
    const updatedProj = await request(app)
        .put(`/api/projects/${project.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: newName})

    expect(updatedProj.statusCode).toBe(200)
    expect(updatedProj.body.name).toEqual(newName)
  })

  it('should delete a project', async () => {
    const projectName = 'Project to delete'
    const projectToDelete = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: projectName })
    await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Project 2' })

    await request(app)
        .delete(`/api/projects/${projectToDelete.body._id}`)
        .set('Authorization', `Bearer ${token}`)

    const allProjects = await request(app).get('/api/projects').set('Authorization', `Bearer ${token}`)
    const projectNames = allProjects.body.map((proj: { name: string }) => proj.name)

    const projNamesWithoutDeleted = ['Project 2']

    expect(projectNames).toEqual(projNamesWithoutDeleted)
  })
})
