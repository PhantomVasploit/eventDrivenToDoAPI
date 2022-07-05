const express = require('express');

const router = express.Router();

const {register, login, updateAccount, deleteAccount} = require('../controller/user.controller');

router.post('/register', register);
router.post('/login', login);
router.put('/:userId', updateAccount);
router.delete('/:userId', deleteAccount);

module.exports = router;
