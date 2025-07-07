import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

interface AuthRequest extends Request {
  user?: any
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
        res.status(401).json({ message: 'User not found' })
        return
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }
}
