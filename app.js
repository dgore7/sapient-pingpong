var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
require('./api/models/db');

var app = express();


const PORT = process.env.PORT || 80;

var scoreboardAPI = require('./api/routes/scoreboard');

app.use(bodyParser.json({type: '*/*'}));
app.use(express.static('pub'));
app.use('/api', scoreboardAPI);

// Server
var server = http.createServer(app);
server.listen(PORT);
