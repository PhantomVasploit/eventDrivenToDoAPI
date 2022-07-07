const logger = require('../config/winston.config');

module.exports.errorLogging = (err, req, res, next)=>{
  res.status(500).json({message: `Error on the server: ${err.message}`});
  logger.error(err.message, err);
  next();
}
