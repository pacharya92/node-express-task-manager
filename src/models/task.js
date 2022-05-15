import mongoose from 'mongoose'
import validator from 'validator'

const Task = mongoose.model('task', {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

export default Task