# Winston Wrapper 
Winston Wrapper is a reusable module that is designed as a logging framework like log4j in java. 
I hvae used [winston] as base and build a reusable framework in which you dont need to do any wiring for using winston in your [express] or [serverless]. 
A Co-relation id is added in this same framework with you can track the complete request flow in your application 
## Table of Contents 
* [Installation](#to-install-as-dependency)
* [Express-Middleware](#using-express-middleware)
* [Serverless](#for-serverless-framework)
```

















































```
### To Install as dependency
```sh
npm install https://github.com/siddhirajpantojitravelex/winston-wrapper.git --save 
```
### Using Express Middleware
This framework is tested with [express] >=4.0 
```js
// app.js 
var app = require('express');
var winston = require('winston_wrapper');
... // Other middleware and libraries if any 
app.use(winston.expressMiddleware);

... // Code to be continued 
```
In other file within context of request  i.e Request handler file 
```js
// controller.js
const logger  = require('winston_wrapper').getLogger('controller') // This is how you get the instance of logger for the file 
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
[winston]:<https://github.com/winstonjs/winston#readme>
[express]:<http://expressjs.com/>
[serverless]:<https://serverless.com/framework/docs/providers/aws/guide/quick-start/>
[full example]:<https://github.com/siddhirajpantojitravelex/winston-wrapper-example>