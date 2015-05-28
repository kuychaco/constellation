/* 
* @Author: kuychaco
* @Date:   2015-05-27 11:28:39
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-05-27 14:59:28
*_________________________________________
* Server-Side Entry Point
* - configure server with appropriate port
* - listen for requests from client
*/

'use strict';

// Import express app
var app = require('./server/server-config').app;

// If deployed in production environment, get port from environment variable
var port = process.env.PORT || 2345;

// Listen for requests on appropriate port
app.listen(port);
console.log('Server listening on port:', port);
