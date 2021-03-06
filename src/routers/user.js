import express from 'express'
import User from '../models/user.js'
import auth from '../middleware/auth.js'

const router = new express.Router()


router.post('/users', async (req, res) => {
  const user = new User(req.body)
  const token = await user.generateAuthToken()
  try {
    await user.save()
    res.status(201).send({ user, token })
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/users/login', async(req, res) => {
  try {
    const user =  await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch(e){
      res.status(400).send()
  }
})

router.post('/users/logout', auth, async(req,res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) =>{
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async(req,res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  try {
    res.send(req.user)
  } catch (err) {
    res.status(500).send(err)
  }
})


router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      updates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
      res.send(req.user)
  } catch (e) {
      res.status(400).send(e)
  }
})

router.delete('/users/me', auth,  async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(404).send()
  }
})

export default router
