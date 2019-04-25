var logTypes = require('./logType');
//console.log(logTypes);
module.exports = {
    pattern : "[${label}] ${timestamp} [Co-relation-id : ${traceID}] [${level}]: ${message} ",
    datetimePattern : "YYYY-MM-DD HH:mm:ss",
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
      }, 
      {
        // File - Rolling File appender  
        type:logTypes.File,
        options : {
          level: 'info',
          filename: 'app.log',
          handleExceptions: true,
          json: true,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          colorize: false,
        }
      }, 
      {
        // Only File based on error Level 
        type:logTypes.File,
        options : {
          level: 'error',
          filename: 'error.log',
          handleExceptions: true,
          json: true,
          colorize: false,
        }
      }
    ]
  }