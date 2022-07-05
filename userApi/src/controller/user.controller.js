const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../model/user.model');
const {createToken} = require('../utils/jwt.token');

module.exports.register = (req, res)=>{
  const {firstName, lastName, email, password} = req.body;
  User.create({firstName, lastName, email, password})
  .then((user)=>{
    const jwt = createToken(_.pick(user, ['_id', 'permission']))
    res.status(201).json({message: 'User account created successfully', user: _.pick(user, ['_id', 'firstName', 'lastName', 'email']), jwt});
  })
  .catch((e)=>{
    res.status(400).json({message: `Error creating user account: ${e.message}`});
    console.log(`Error @ the register handler: ${e.message}`);
  })
}

module.exports.login = async (req, res)=>{
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    console.log(`${JSON.stringify(user)}`);
    if(!user){
      res.status(400).json({message: 'Invalid login credentials'});
    }else {
      const auth = await bcrypt.compare( password, user.password );
      if(!auth){
        res.status(400).json({message: 'Invalid login credentials'});
      }else {
        const jwt = createToken(_.pick(user, ['_id', 'permission']));
        res.status(200).json({message: `Login successful`, user: _.pick(user, ['_id', 'firstName', 'lastName', 'email']), jwt});
      }
    }
  } catch (e) {
    console.log(`Error @ the login handler: ${e.message}`);
  }
}

module.exports.updateAccount = (req, res)=>{
  const toId = mongoose.Types.ObjectId;
  const userId = toId(req.params.userId);
  const {firstName, lastName, email} = req.body;
  User.findOneAndUpdate({_id: userId}, {firstName, lastName, email})
  .then(()=>{
    res.status(200).json({message: `Account updated successfully`});
  })
  .catch((e)=>{
    res.status(400).json({message: `Failed to update account: ${e.message}`});
  });
}

module.exports.deleteAccount = (req, res)=>{
  const toId = mongoose.Types.ObjectId;
  const userId = toId(req.params.userId);
  User.findOneAndDelete({_id: userId})
  .then((user)=>{
    res.status(200).json({message: `User account deleted successfully`, user: _pick(user, ['_id', 'firstName', 'lastName', 'email'])})
  })
  .catch((e)=>{
    res.status(400).json({message: `Error deleting user account: ${e.message}`});
  })
}
