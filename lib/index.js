var log4js = require('log4js/lib/log4js');
var defaultConfig = require('../config/log4js')
function getLogger(loggerName) {
	return log4js.getLogger(loggerName);
}

function initLogger() {
	try {
		require('fs').mkdirSync('./log');
	} catch (e) {
		if (e.code != 'EEXIST') {
			console.error("Could not set up log directory, error was: ", e);
			process.exit(1);
		}
	}
}

function configureLogger(config)
{
	log4js.configure(config);
}

function configureLogger()
{
	configureLogger(defaultConfig);
}

module.exports.travelex_logger = {
	getLogger,initLogger,configureLogger
}

// module.exports.printSomething = function (){
// 	console.log("asdashd")
// }