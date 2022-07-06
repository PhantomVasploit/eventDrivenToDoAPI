const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'title field is required']
  },
  details:{
    type: String,
    trim: true,
    required: [true, 'details field is required']
  },
  time: {
    type: Date,
    required: [true, 'time field is require'],
    default: new Date()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
