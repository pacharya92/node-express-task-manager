import express from 'express'
import Task from '../models/task.js'

const router = new express.Router()

router.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  try {
    const task = await Task.findByIdAndDelete(taskId)
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(404).send()
  }
})

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const task = await Task.find({})
    res.send(task)
  } catch (err) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  try {
    const task = await Task.findById(taskId)
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (err) {
    res.status(500).send()
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const updateKeys = Object.keys(req.body)
  console.log(updateKeys)
  const allowedUpdateKeys = ['description', 'completed']
  const isValidOperation = updateKeys.every(updateKey =>
    allowedUpdateKeys.includes(updateKey)
  )
  console.log(isValidOperation)
  if (!isValidOperation) {
    console.log(107)
    return res.status(400).send({error: 'Invalid updates!'})
  }
  try {
    const task = await Task.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.send(400).send(e)
  }
})

export default router
