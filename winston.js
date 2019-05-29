//var appRoot = require('app-root-path');
var winston = require('winston');
const cls = require('cls-hooked');
const uuidv4 = require('uuid/v4');
var appRoot = require('app-root-path');
const path = require('path');
const fs = require('fs');

const clsNamespace = cls.createNamespace('app')
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

var logConfig = require('./log-config');
console.log("Root path " + appRoot.path);
var extPath = path.join(appRoot.path, path.sep, 'log-config.js');
isExtConfg = fs.existsSync(extPath);
var extConfig = undefined;
if (isExtConfg) {
  
  extConfig = require(extPath);
  
  logConfig = extConfig;
}
//var extConfig = require(path.join(appRoot.path,path.sep,'logConfig'));


const addTraceId = printf(({ level, message, label, timestamp }) => {
  // let message = info.message
  const correlationid = clsNamespace.get('correlationid')
  // if (traceID) {
  //   message = `[co-relation-id: ${traceID}]: ${message}` 
  //   // Timestamp 
  // }
  // Formatting of message is done here 
  //return eval("`" + logConfig.pattern + "`");
  return (logConfig.pattern.replace("${label}",label).replace("${level}",level).replace("${message}",message).replace("${timestamp}",timestamp).replace("${correlationid}",traceID));
  // replace with str.replace
  //return `[${label}] ${timestamp} Co-relation-id : ${traceID} Level : ${level}: ${message}`;
  //return message
})
// instantiate a new Winston Logger with the settings defined above
exports.getLogger = (loggerName) => {
  // var logger = new winston.createLogger({
  //   format: addTraceId,
  //   transports: [
  //     new winston.transports.File(options.file),
  //     new winston.transports.Console(options.console)
  //   ],
  //   exitOnError: false, // do not exit on handled exceptions
  // });
  var transportsArr = [];
  for (i = 0; i < logConfig.appenders.length; i++) {
    var appender = logConfig.appenders[i];
    transportsArr.push(new appender.type(appender.options));
  }
  const logger = createLogger({
    format: combine(
      label({ label: loggerName }),
      timestamp(),
      addTraceId
    ),
    transports: transportsArr,
    exitOnError: false
  });
  return logger;
}

exports.expressMiddleware = (req, res, next) => {
  // req and res are event emitters. We want to access CLS context inside of their event callbacks
  clsNamespace.bind(req)
  clsNamespace.bind(res)
  var traceID = req.headers.traceID;
  if (!traceID) {
    traceID = uuidv4();
    req.headers.traceID = traceID;
  }

  clsNamespace.run(() => {
    
    clsNamespace.set('traceID', traceID)
    next()
  })
}

exports.serverlessFunction = (event, context, callback) => {
  // Same as binding request event 
  clsNamespace.bind(event);
  var traceID = undefined;
  if (typeof event.headers == undefined) {
    event.headers = {}
  }
  if (typeof event.headers.correlationid == "undefined") {
    correlationid = uuidv4();
    event.headers.correlationid = correlationid;
  }
  else {
    correlationid = event.headers.correlationid;
  }

  clsNamespace.run(() => {
    clsNamespace.set('correlationid', correlationid)
    callback(event, context)
  })
}
exports.serverlessPromise = (event) => {
  return new Promise((resolve, reject) => {
    clsNamespace.bind(event);
    var correlationid = undefined;
    if (typeof event.headers == undefined) {
      event.headers = {}
    }
    if (typeof event.headers.correlationid == "undefined") {
      correlationid = uuidv4();
      event.headers.correlationid = correlationid;
    }
    else {
      correlationid = event.headers.correlationid;
    }
    
    clsNamespace.run(() => {
      clsNamespace.set('correlationid', correlationid)
      resolve(event);
      //callback(event, context)
    })
  })
}
exports.serverlessPromise = (event) => {
  return new Promise((resolve, reject) => {
    clsNamespace.bind(event);
    var correlationid = undefined;
    if (typeof event.headers == undefined) {
      event.headers = {}
    }
    if (typeof event.headers.correlationid == "undefined") {
      correlationid = uuidv4();
      event.headers.correlationid = correlationid;
    }
    else {
      correlationid = event.headers.correlationid;
    }
  
    clsNamespace.run(() => {
      clsNamespace.set('correlationid', correlationid)
      resolve(event);
      //callback(event, context)
    })
  })
}
//module.exports = { getLogger, expressMiddleware, serverlessFunction };