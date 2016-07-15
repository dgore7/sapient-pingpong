var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const HOST = "10.50.173.32";
const PORT = 8080;

var routesAPI = require('./api/routes/index');

app.use(bodyParser.json({type: '*/*'}));
app.use(express.static('pub'));
app.use('/api', routesAPI);

// Server
var server = http.createServer(app);
server.listen(PORT, HOST, function() {
  console.log("Server listening on http://%s:%s", HOST, PORT);
});
