# Winston Wrapper 
Winston Wrapper is a reusable module that is designed as a logging framework like log4j in java. 
I hvae used [winston] as base and build a reusable framework in which you dont need to do any wiring for using winston in your [express] or [serverless]. 
A Co-relation id is added in this same framework with you can track the complete request flow in your application 

### To Install as dependency 
```sh
npm install https://github.com/siddhirajpantoji/testLogger.git --save 
```
### Using Express Middleware . 
This framework is tested with [express] >=4.0 
```sh
// app.js 
var app = require('express');
var winston = require('winston_wrapper');
... // Other middleware and libraries if any 
app.use(winston.expressMiddleware);

... // Code to be continued 
```
In other file within context of request  i.e Request handler file 
```sh
// controller.js
const logger  = require('winston_wrapper').getLogger('controller') // This is 
function (req,res ){
    logger.info("Inside Controller ")
}
```
[winston]:<https://github.com/winstonjs/winston#readme>
[express]:<http://expressjs.com/>
[serverless]:<https://serverless.com/framework/docs/providers/aws/guide/quick-start/>