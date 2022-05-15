import mongoose from 'mongoose'
import validator from 'validator'

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    },
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 6) {
        throw new Error('Passwords must be more than six characters.')
      }
      if (value.toLowerCase().includes('password')) {
        throw new Error("A new password cannot include the word 'password'")
      }
    },
  },
})

export default User
