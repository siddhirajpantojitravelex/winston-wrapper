const {transports} = require('winston')
const logTypes = {
    "Console": transports.Console, 
    "File": transports.File
  }
module.exports = logTypes