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

var mongoose = require('mongoose');
var gracefulShutdown;

// var dbURI = 'mongodb://heroku_d2772s7c:6oksljcds6r2v6hf3c8prt2uv7@ds033133.mlab.com:33133/heroku_d2772s7c'; // MLab URI

var dbURI = process.env.NODE_ENV==="production"?
  'mongodb://heroku_d2772s7c:6oksljcds6r2v6hf3c8prt2uv7@ds033133.mlab.com:33133/heroku_d2772s7c': // MLab URI
  'mongodb://localhost/pingpong'; // Local dev db

mongoose.connect(dbURI);

/* Listening for Mongoose connection events */
mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err){
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected');
});

/* Reusable function to close Mongoose connection */
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
  });
};

/* Graceful shutdown blocks */
// for nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// for app termination
process.once('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});

// for Heroku app termination
process.on('SIGTERM', function () {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});
