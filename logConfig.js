var logTypes = require('./logType');
module.exports = {
    pattern : "[${label}] ${timestamp} [Co-relation-id : ${traceID}] [${level}]: ${message} ",
    appenders : [
      {
        // Console 
        type:logTypes.Console,
        options : {
          level: 'debug',
          handleExceptions: true,
          json: false,
          colorize: true,
        }
      }
    ]
  }
