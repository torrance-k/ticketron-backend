import { Request, Response } from 'express'
import Project from '../models/Project'

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate('owner members')
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects' })
  }
}

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id).populate('owner members')
    if (!project) {
      res.status(404).json({ message: 'Project not found' })
      return
    } 
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project' })
  }
}

export const createProject = async (req: Request, res: Response) => {
  const userId = req.user?._id

  try {
    const newProject = new Project({ name: req.body.name, owner: userId, members: [userId] })
    await newProject.save()
    res.status(201).json(newProject)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project' })
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project' })
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project' })
  }
}
