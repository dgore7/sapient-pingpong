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
var Pusher = require('pusher');
require('../models/user');
var Users = mongoose.model("User");
var secret = require('../../secret');

console.log(secret.pusher);
var pusher = new Pusher({
  appId: '225891',
  key: '3c2527d150d803fc2cd0',
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
