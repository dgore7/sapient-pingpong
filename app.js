var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
var exphbs = require('express-handlebars');
var secret = require('./secret');
const path = require('path');
require('./api/models/db');

var pusher = new Pusher({
  appId: '225891',
  key: '45a78a912c58902f2b95',
  secret: secret,
  cluster: 'eu',
  encrypted: true
});

const PORT = process.env.PORT || 80;

var app = express();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.engine('handlebars', exphbs({layoutsDir:"/app_server/"}));
app.set('view engine', 'handlebars');

var routesAPI = require('./api/routes/index');
var routes = require('./app_server/routes/index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: '*/*'}));
app.use(express.static('pub'));
app.use('/api', routesAPI);
app.use('/', routes);

// Server
var server = http.createServer(app);
server.listen(PORT);
