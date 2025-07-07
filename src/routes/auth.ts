import { Router } from 'express'
import { registerUser, loginUser } from '../controllers/authController'
import { requireAuth } from '../middleware/authMiddleware'

const router = Router()

router.use(requireAuth)

router.post('/register', registerUser)
router.post('/login', loginUser)

export default router
