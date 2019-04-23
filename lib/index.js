//var appRoot = require('app-root-path');
var winston = require('winston');
const cls = require('cls-hooked');
const uuidv4 = require('uuid/v4');
const clsNamespace = cls.createNamespace('app')


// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: 'app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const addTraceId = winston.format.printf((info) => {
  let message = info.message
  const traceID = clsNamespace.get('traceID')
  if (traceID) {
    message = `[TraceID: ${traceID}]: ${message}`
  }
  return message
})
// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
  format: addTraceId,
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {

  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

var expressMiddleware = (req, res, next) => {
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

var serverlessFunction = (event, context, callback) => {
  // Same as binding request event 
  clsNamespace.bind(event);
  var traceID = undefined;
  if (typeof event.headers == undefined) {
    event.headers = {}
  }
  if (typeof event.headers.traceID == "undefined") {
    traceID = uuidv4();
    event.headers.traceID = traceID;
  }
  else {
    traceID = event.headers.traceID;
  }
  console.log(traceID)
  clsNamespace.run(() => {
    clsNamespace.set('traceID', traceID)
    callback( event, context)
  })
}
module.exports = { logger, expressMiddleware , serverlessFunction};
