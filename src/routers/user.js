import express from 'express'
import User from '../models/user.js'

const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/users', async (req, res) => {
  try {
    const user = await User.find({})
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/users/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (err) {
    res.status(404).send()
  }
})

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  console.log(updates)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.statu(404).send()
    }
    res.send(user)
  } catch (e) {
    res.status(404).send()
  }
})

export default router
