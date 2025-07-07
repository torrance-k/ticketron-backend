import express from 'express'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import issueRoutes from './routes/issues'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/issues', issueRoutes)

export default app