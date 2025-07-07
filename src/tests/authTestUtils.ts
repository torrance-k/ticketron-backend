import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export const createTestUserAndToken = async () => {
  const hashedPassword = await bcrypt.hash('testpass', 10)

  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: hashedPassword,
  })

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' })

  return { user, token }
}
