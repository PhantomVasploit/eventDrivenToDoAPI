const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const winston = require('winston');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
require('./config/db.config');
const {errorLogging} = require('./middleware/errorLogging');
const logger = require('./config/winston.config');
const routes = require('./routes/routes');

winston.exceptions.handle(new winston.transports.File({filename: "Exception.log"}));
process.on('unhandledRejection', (ex)=>{
  throw ex;
});

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/user', routes);
app.use(errorLogging);

const server = app.listen(port, ()=>{
  logger.info(`User service running on: http://127.0.0.1:${port}\n`)
  console.log(`User service running on: http://127.0.0.1:${port}\n`);
})

module.exports = server;
