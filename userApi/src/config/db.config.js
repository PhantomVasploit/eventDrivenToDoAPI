const mongoose = require('mongoose');

const logger = require('./winston.config');

mongoose.connect(process.env.DATABASE_URI, {useUnifiedTopology: true});

mongoose.connection.once('open', ()=>{
  logger.info(`Database server connected\n`);
  console.log(`Database server connected\n`);
}).on('error', (error)=>{
  logger.error(error.message, error);
  console.log(`Error connecting to database server: ${error.message}`);
})
