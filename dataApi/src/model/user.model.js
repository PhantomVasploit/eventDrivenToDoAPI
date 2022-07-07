const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'firstName field is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'lastName field is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'email field is required'],
    unique: [true, 'email field must be unique'],
    trim: true
  },
  permission: {
    create: {
      type: Boolean,
      default: true
    },
    read: {
      type: Boolean,
      default: true
    },
    update: {
      type: Boolean,
      default: true
    },
    delete: {
      type: Boolean,
      default: true
    }
  }
});


const User = mongoose.model('User', userSchema);
module.exports = User;
