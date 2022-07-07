const express = require('express');

const router = express.Router();

const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controller/todo.controller');

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/', updateTodo);
router.delete('/', deleteTodo);

module.exports = router;
