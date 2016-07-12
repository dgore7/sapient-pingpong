// TODO: This file should contain the logic that currently resides in the users route
var mongoose = require('mongoose');

// This is a utility function for sending response
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
