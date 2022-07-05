const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.json(),
  defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combine.log'}),
    new winston.transports.MongoDB({
      db: process.env.DATABASE_LOGS_URI,
      options: {
         useUnifiedTopology: true
      }
    })
  ]
});

module.exports = logger;
