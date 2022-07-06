const _ = require('lodash');

const User = require('../model/user.model');
const Todo = require('../model/user.model');

module.exports.getTodos = (req, res)=>{
  Todo.find({})
  .then((todos)=>{
    res.status(200).json({message: 'Fetch successful', todos: _.pick(todos, ['title', 'details', 'time'])});
  })
  .catch((e)=>{
    res.status(400).json({message: `Error fetching todos: ${e.message}`});
  })
}

module.exports.createTodo = (req, res)=>{
  const {title, details} = req.body;
  Todo.create({title, details})
  .then((todo)=>{
    res.status(201).json({message: 'Todo created successful', todo: _.pick(todo, ['title', 'details', 'time'])})
  })
  .catch((e)=>{
    res.status(400).json({message: `Error creating todos: ${e.message}`});
  })
}
