const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const winston = require('winston');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;
const {errorLogging} = require('./middleware/errorLogging');
const logger = require('./config/winston.config');
const routes = require('./routes/routes');
require('./config/db.config');
require('./messagebroker/consumer');

winston.exceptions.handle(new winston.transports.File({filename: "Exception.log"}));
process.on('unhandledRejection', (ex)=>{
  throw ex;
});


app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/to-do', routes);
app.use(errorLogging);

app.listen(port, ()=>{
  logger.info(`Todo service started on http://127.0.0.1:${port}`);
  console.log(`Todo service started on http://127.0.0.1:${port}`);
});
