var logTypes = require('./log-type');
module.exports = {
    pattern : "[${label}] ${timestamp} [Co-relation-id : ${correlationid}] [${level}]: ${message} ",
    appenders : [
      {
        // Console 
        type:logTypes.Console,
        options : {
          level: process.env.LOG_LEVEL || 'info',
          handleExceptions: true,
          json: false,
          colorize: true,
        }
      }
    ]
  }
