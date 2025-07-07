import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' })
    res.status(201).json({ user: newUser, token })
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' })
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user){
        res.status(400).json({ message: 'Invalid credentials' })
        return 
    } 

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' })
        return
    }  

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' })
    res.status(200).json({ user, token })
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' })
  }
}
