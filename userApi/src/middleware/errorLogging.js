const logger = require('../config/winston.config');

module.exports.errorLogging = (err, req, res, next)=>{
  logger.error(err.message, err);
  res.status(500).json({message: `Error occured on the server: ${err.message}`});
}
