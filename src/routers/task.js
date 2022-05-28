import express from 'express'
import Task from '../models/task.js'
import auth from '../middleware/auth.js'

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('tasks')
    console.log(req.user.tasks)
    res.send(req.user.tasks)
  } catch (err) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const taskId = req.params.id
  try {
    const task = await Task.findOne({_id: taskId, owner: req.user._id})
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (err) {
    res.status(500).send()
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const taskId = req.params.id
  const updateKeys = Object.keys(req.body)
  const allowedUpdateKeys = ['description', 'completed']
  const isValidOperation = updateKeys.every(updateKey =>
    allowedUpdateKeys.includes(updateKey)
  )

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }
  try {
    const task = await Task.findOne({_id: taskId, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }

    updateKeys.forEach(updateKey => (task[updateKey] = req.body[updateKey]))
    await task.save()
    res.send(task)
  } catch (e) {
    res.send(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const taskId = req.params.id
  try {
    const task = await Task.findOneAndDelete({_id: taskId, owner: req.user._id})
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(404).send()
  }
})

export default router
