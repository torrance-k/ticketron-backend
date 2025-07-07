import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import issueRoutes from './routes/issues'
import { requireAuth } from './middleware/authMiddleware'

const app = express()

app.use(cors())
app.use(express.json())

// Public routes
app.use('/api/auth', authRoutes)

// Protected routes
app.use('/api/projects', requireAuth, projectRoutes)
app.use('/api/issues', requireAuth, issueRoutes)

app.get('/', (_req, res) => {
  res.send('Issue Tracker API is running')
})

export default app
