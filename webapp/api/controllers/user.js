var mongoose = require('mongoose');
var Pusher = require('pusher');
require('../models/user');
var Users = mongoose.model("User");
var secret = require('../../secret');

console.log(secret.pusher);
var pusher = new Pusher({
  appId: '225891',
  key: '45a78a912c58902f2b95',
  secret: secret.pusher,
  cluster: 'eu',
  encrypted: true
});



var sendJSONResponse = function (res,status,content) {
  res.status(status);
  res.json(content);
}; //sendJSONResponse

module.exports.createUser = function(req, res) {
  console.log(req.body);
  Users.create({
    _id: req.body.rfid,
    name: req.body.name.trim()
  }, function(err, user) {
    if (!err) {
      sendJSONResponse(res, 201, user);
    } else {
      sendJSONResponse(res, 400, err);
    }
  });
}

module.exports.readUser = function (req,res) {
  if(req.body && req.body.rfid) {
    console.log(req.body);
    Users
      .findById(req.body.rfid)
      .exec(function (err, user) {
        if (err) {
          sendJSONResponse(res, 404, err);
          return;
        }
        else if(!user) {
          sendJSONResponse (res, 200, null);
          pusher.trigger('scoreboard', 'user-sign-in', {userExists:false, rfid:req.body.rfid});
        } else {
          sendJSONResponse (res, 200, user);
          pusher.trigger('scoreboard', 'user-sign-in', {userExists:true, user:user});
        }
      });
  } else {
    sendJSONResponse (res, 404, {message: "No RFID in request"});
  }
};
