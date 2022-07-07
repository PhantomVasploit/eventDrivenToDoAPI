const _ = require('lodash');
const mongoose = require('mongoose');

const User = require('../model/user.model');
const Todo = require('../model/user.model');

module.exports.getTodos = (req, res)=>{
  Todo.find({})
  .then((todos)=>{
    res.status(200).json({message: 'Fetch successful', todos: _.pick(todos, ['title', 'details', 'time'])});
  })
  .catch((e)=>{
    res.status(400).json({message: `Error fetching todos: ${e.message}`});
    console.log(`Error @ the get todos handler: ${e.message}`);
    throw e;
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
    console.log(`Error @ the createTodo handler: ${e.message}`);
    throw e;
  })
}

module.exports.updateTodo = (req, res)=>{
  const toId = mongoose.Types.ObjectId;
  const todoId = toId(req.params.todoId);
  const {title, details} = req.body;
  Todo.findOneAndUpdate({_id:todoId}, {title, details})
  .then(()=>{
    res.status(200).json({message: `Todo item updated successful`})
  })
  .catch((e)=>{
    res.status(400).json({message: `Error updating todo item: ${e.message}`});
    console.log(`Error @ the updateTodo handler: ${e.message}`);
    throw e;
  })
}

module.exports.deleteTodo = (req, res)=>{
  const toId = mongoose.Types.ObjectId;
  const todoId = toId(req.params.todoId);
  Todo.findOneAndRemove({_id: todoId})
  .then((todo)=>{
    res.status(200).json({message: `Todo item deleted successfully`, todo: _.pick(todo, ['title', 'details'])});
  })
  .catch((e)=>{
    res.status(400).json({message: `Error deleting todo item: ${e.message}`});
    console.log(`Error @ the delete todo handler: ${e.message}`);
    throw e;
  })
}
