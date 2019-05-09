# Winston Wrapper 
Winston Wrapper is a reusable module that is designed as a logging framework like log4j in java. 
I hvae used [winston] as base and build a reusable framework in which you dont need to do any wiring for using winston in your [express] or [serverless]. 
A Co-relation id is added in this same framework with you can track the complete request flow in your application 
## Table of Contents 
* [Pre-requisite](#pre-requisite)
* [Installation](#to-install-as-dependency)
* [Express-Middleware](#using-express-middleware)
* [Serverless](#for-serverless-framework)
* [Custom Configuration](#custom-configuration)
### Pre Requisite 
1. Readonly access to this repository 
2. SSH Key enabled for your account from which you are accessing 
3. If your SSH Key is not enabled then follow [enable ssh]
### To Install as dependency
```sh
npm install https://github.com/travelex/winston-wrapper.git --save 
```
### Using Express Middleware
This framework is tested with [express] >=4.0 
```js
// app.js 
var app = require('express');
var winston = require('winston-wrapper');
... // Other middleware and libraries if any 
app.use(winston.expressMiddleware);

... // Code to be continued 
```
In other file within context of request  i.e Request handler file 
```js
// controller.js
const logger  = require('winston-wrapper').getLogger('controller') // This is how you get the instance of logger for the file 
function (req,res ){
    logger.info("Inside Controller ")
}
```
```
// Output on console 
[Controller] 2019-05-08T13:28:37.516Z [Co-relation-id : 01aab8bb-1077-43fe-b4ae-9a78d0e92bdb] [info]: Inside Controller
```
In the above example co-relation-id is generated and tagged along with the scope. This value is binded with the scope of request. Value remains same in multiple files when getLogger function is called. 
Refer **[full example]** for its complete implemented project 

### For serverless framework
In this part we are binding event object of the serverless hanlder function of AWS. 
 You can visit [serverless] for getting started on lamda functions 
 
 ```js
 // handler.js
 const winston = require('winston-wrapper');
 var logger = winston.getLogger('handler');
 
module.exports.handler = (event, context, callback )=>{
winston.serverlessFunction(event, context , (_event,_context)=>{
	// handler Code goes over here and callback is used for response 
    logger.info("Inside handler ");
  })
}
 ```
In Service we will be using same logger . In serverless the Event is bind for traceId . Like we did with request in express 

```js
// service.js
var logger = require('winston-wrapper').getLogger('Service')
function anyFunc(){
logger.info("Inside anyFun ")
}
```

### Custom Configuration
[winston]:<https://github.com/winstonjs/winston#readme>
[express]:<http://expressjs.com/>
[serverless]:<https://serverless.com/framework/docs/providers/aws/guide/quick-start/>
[full example]:<https://github.com/siddhirajpantojitravelex/winston-wrapper-example>
[enable ssh]:<https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account>