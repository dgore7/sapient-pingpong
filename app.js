var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
var secret = require('./secret');
require('./api/models/db');

var pusher = new Pusher({
  appId: '225891',
  key: '45a78a912c58902f2b95',
  secret: secret,
  cluster: 'eu',
  encrypted: true
});


var app = express();


const PORT = process.env.PORT || 3000;

var routesAPI = require('./api/routes/index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: '*/*'}));
app.use(express.static('pub'));
app.use('/api', routesAPI);

// Server
var server = http.createServer(app);
server.listen(PORT);
