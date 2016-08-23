/*
 * MIT License
 *
 * Copyright (c) 2016 David Gorelik, Wes Hampson.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var secret = require('./secret');
const path = require('path');
require('./api/models/db');


const PORT = process.env.PORT || 3000;

var app = express();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.engine('handlebars', exphbs({layoutsDir:"/app_server/"}));
app.set('view engine', 'handlebars');

var routesAPI = require('./api/routes/index');
var routes = require('./app_server/routes/index');

app.use(bodyParser.json({type: '*/*'}));
app.use(express.static('webapp/pub'));
app.use('/api', routesAPI);
app.use('/', routes);

// Server
var server = http.createServer(app);
server.listen(PORT);
