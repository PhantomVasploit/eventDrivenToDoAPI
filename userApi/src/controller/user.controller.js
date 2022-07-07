const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const amqp = require('amqplib');

const User = require('../model/user.model');
const {createToken} = require('../utils/jwt.token');
const logger = require('../config/winston.config');
const exchangeName = 'User';

module.exports.register = async(req, res)=>{
  try {
    const {firstName, lastName, email, password} = req.body;
    const user = new User({firstName, lastName, email, password})
    await user.save();
    const connection = await amqp.connect(process.env.AMQP_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {durabel: true});
    channel.publish(exchangeName, 'create', Buffer.from(JSON.stringify(user)));
    connection.close();
    const jwt = createToken(_.pick(user, ['_id', 'permission']));
    res.status(201).json({message: 'User account created successfully', user: _.pick(user, ['_id', 'firstName', 'lastName', 'email']), jwt});
  } catch (e) {
    res.status(400).json({message: `Error creating user account: ${e.message}`});
    logger.error(e.message, e);
    console.log(`Error @ the register handler: ${e.message}`);
  }
}

module.exports.login = async (req, res)=>{
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
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

module.exports.updateAccount = async (req, res)=>{
  try {
    const toId = mongoose.Types.ObjectId;
    const userId = toId(req.params.userId);
    const {firstName, lastName, email} = req.body;
    const user = await User.findOneAndUpdate({_id: userId}, {firstName, lastName, email});
    const connection = await amqp.connect(process.env.AMQP_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {durabel: true});
    channel.publish(exchangeName, 'update', Buffer.from(JSON.stringify(user)));
    connection.close();
    res.status(200).json({message: `Account updated successfully`});
  } catch (e) {
    res.status(400).json({message: `Failed to update account: ${e.message}`});
    console.log(`Error @ the update user account handler: ${e.message}`);
    logger.error(e.message, e);
  }
}

module.exports.deleteAccount = async (req, res)=>{
  try {
    const toId = mongoose.Types.ObjectId;
    const userId = toId(req.params.userId);
    const user = await User.findOneAndRemove({_id: userId});
    const connection = await amqp.connect(process.AMQP_URI);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {durabel: true});
    channel.publish(exchangeName, 'delete', Buffer.from(JSON.stringify(user)));
    connection.close();
    res.status(200).json({message: 'User account deleted successfully', user: _.pick(user, ['firstName', 'lastName', 'email', '_id'])});
  } catch (e) {
    res.status(400).json({message: `Error deleting user account: ${e.message}`});
    logger.error(e.message, e);
    console.log(`Error on the delete account handler: ${e.message}`);
  }
}
