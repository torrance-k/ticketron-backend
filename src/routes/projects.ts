import { Router } from 'express'
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/', getAllProjects)
router.post('/', createProject)
router.get('/:id', getProjectById)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router
