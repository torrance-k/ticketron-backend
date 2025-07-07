import { Request, Response } from 'express'
import Issue from '../models/Issue'

export const getAllIssuesForProject = async (req: Request, res: Response) => {
  try {
    const issues = await Issue.find({ project: req.params.projectId })
      .populate('assignee createdBy')
    res.json(issues)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch issues' })
  }
}

export const createIssue = async (req: Request, res: Response) => {
  const { title, description, status, priority, tags, assignee, createdBy } = req.body
  const { projectId } = req.params

  try {
    const newIssue = new Issue({
      title,
      description,
      status,
      priority,
      tags,
      assignee,
      createdBy,
      project: projectId,
    })

    await newIssue.save()
    res.status(201).json(newIssue)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create issue' })
  }
}

export const getIssueById = async (req: Request, res: Response): Promise<void> => {
  try {
    const issue = await Issue.findById(req.params.id).populate('assignee createdBy')
    if (!issue) {
      res.status(404).json({ message: 'Issue not found' })
      return
    }  
    res.json(issue)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch issue' })
  }
}

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const updated = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update issue' })
  }
}

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    await Issue.findByIdAndDelete(req.params.id)
    res.json({ message: 'Issue deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete issue' })
  }
}
