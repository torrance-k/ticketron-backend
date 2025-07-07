import { Router } from 'express'
import {
  getAllIssuesForProject,
  createIssue,
  getIssueById,
  updateIssue,
  deleteIssue
} from '../controllers/issueController'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.use(requireAuth)

router.get('/project/:projectId', getAllIssuesForProject)
router.post('/project/:projectId', createIssue)
router.get('/:id', getIssueById)
router.put('/:id', updateIssue)
router.delete('/:id', deleteIssue)

export default router
