import { Router } from 'express'
import {
  getAllIssuesForProject,
  createIssue,
  getIssueById,
  updateIssue,
  deleteIssue
} from '../controllers/issueController'

const router = Router()

router.get('/project/:projectId', getAllIssuesForProject)
router.post('/project/:projectId', createIssue)
router.get('/:id', getIssueById)
router.put('/:id', updateIssue)
router.delete('/:id', deleteIssue)

export default router
