/* 
* @Author: kuychaco
* @Date:   2015-05-27 11:29:56
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-05-27 15:45:04
*_________________________________________
* Configure server with middleware
*/

'use strict';

// Connect to database
// var db = require('./db/db-config').database;
var db = require('./db/models');

var express = require('express');
var morgan = require('morgan'); // logging middleware
var bodyParser = require('body-parser'); // populates req.body

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

module.exports.app = app;