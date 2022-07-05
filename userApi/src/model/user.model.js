const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  password: {
    type: String,
    required: [true, 'password field is required']
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

userSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
