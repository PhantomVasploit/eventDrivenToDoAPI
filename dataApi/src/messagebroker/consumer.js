const amqp = require('amqplib');

const User = require('../model/user.model');
const logger = require('../config/winston.config');

const exchangeName = 'User';

const userConsumer = async ()=>{
  const connection = await amqp.connect(process.env.AMQP_URI);
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'direct', {durable: true});
  const newUserQueue = await channel.assertQueue('', {exclusive: true});
  const updateUserQueue = await channel.assertQueue('', {exclusive: true});
  const deleteQueue = await channel.assertQueue('', {exclusive: true});
  channel.bindQueue(newUserQueue.queue, exchangeName, 'create');
  channel.bindQueue(updateUserQueue.queue, exchangeName, 'update');
  channel.bindQueue(deleteQueue.queue, exchangeName, 'delete');

  channel.consume(newUserQueue.queue, (message)=>{
    if(message.content){
      const data = JSON.parse(message.content.toString());
      User.create(data)
      .then((user)=>{
        logger.info(`Successfully consumed from the User exchange with the create routing key: ${JSON.stringify(user)}`)
      })
      .catch((e)=>{
        logger.error(e.message, e);
      })
    }
  }, {noAck: true});

  channel.consume(updateUserQueue.queue, (message)=>{
    if(message.content){
      const data = JSON.parse(message.content.toString());
      User.findOneAndUpdate({email: data.email}, {firstName:data.firstName, lastName: data.lastName})
      .then(()=>{
        logger.info(`Successfully consumed from the User exchange with update routing key`)
      })
      .catch((e)=>{
        logger.error(e.message, e);
      })
    }
  }, {noAck: true});

  channel.consume(deleteQueue.queue, (message)=>{
    if(message.content){
      const email = message.content.toString();
      User.findOneAndRemove({email})
      .then((user)=>{
        logger.info(`Successfully consumed from the User exchange with the delete routing key: ${JSON.stringify(user)}`);
      })
      .catch((e)=>{
        logger.error(e.message, e);
      })
    }
  }, {noAck: true});
}

userConsumer();
