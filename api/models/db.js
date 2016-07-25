var mongoose = require('mongoose');
var gracefulShutdown;

var dbURI = process.env.NODE_ENV==="production"?'mongodb://localhost/pingpong':'mongodb://heroku_d2772s7c:6oksljcds6r2v6hf3c8prt2uv7@ds033133.mlab.com:33133/heroku_d2772s7c';

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
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});

process.on('uncaughtException', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});
