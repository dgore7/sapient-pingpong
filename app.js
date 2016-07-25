var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
require('./api/models/db');

var app = express();


const PORT = process.env.PORT || 80;

var routesAPI = require('./api/routes/index');

app.use(bodyParser.json({type: '*/*'}));
app.use(express.static('pub'));
app.use('/api', routesAPI);

// Server
var server = http.createServer(app);
server.listen(PORT);
