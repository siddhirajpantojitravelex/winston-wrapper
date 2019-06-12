//var appRoot = require('app-root-path');
var winston = require('winston');
const cls = require('cls-hooked');
const uuidv4 = require('uuid/v4');
var appRoot = require('app-root-path');
const find = require('find');
const clsNamespace = cls.createNamespace('app')
const { createLogger, format } = winston;
const { combine, timestamp, label, printf } = format;

var logConfig = require('./log-config.js');
console.log("Root path " + appRoot.path);

let files = find.fileSync(/\log-config.js$/, appRoot.path)

if (files) {
    if (files && files.length > 0) {
      logConfig = require(files[0])
    } else {
        console.log('external config file not found')
    }
}

//var extConfig = require(path.join(appRoot.path,path.sep,'logConfig'));


const addTraceId = printf(({ level, message, label, timestamp }) => {
  const correlationid = clsNamespace.get('correlationid')
  return (logConfig.pattern.replace("${label}",label).replace("${level}",level).replace("${message}",message).replace("${timestamp}",timestamp).replace("${correlationid}",correlationid));
})
// instantiate a new Winston Logger with the settings defined above
exports.getLogger = (loggerName) => {
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
  var correlationid = req.headers.correlationid;
  if (!correlationid) {
    correlationid = uuidv4();
    req.headers.correlationid = correlationid;
  }

  clsNamespace.run(() => {
    clsNamespace.set('correlationid', correlationid)
    next()
  })
}

exports.serverlessFunction = (event, context, callback) => {
  // Same as binding request event 
  clsNamespace.bind(event);
  var correlationid = undefined;
  if (!event.headers) {
    event.headers = {}
  }
  if (!event.headers.correlationid) {
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
//module.exports = { getLogger, expressMiddleware, serverlessFunction };