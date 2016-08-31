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
require('../models/user');
var Users = mongoose.model("User");
var Pusher = require('pusher');
var Elo = require('arpad');
var secret = require('../../secret');

var uscf = {
  default: 32,
  2100: 24,
  2400: 16
};
var elo = new Elo(uscf, 100);



var pusher = new Pusher({
  appId: '225891',
  key: '3c2527d150d803fc2cd0',
  secret: 'e96c94de2dec0edefb5a',
  cluster: 'eu',
  encrypted: true
});



var sendJSONResponse = function (res,status,content) {
  res.status(status);
  res.json(content);
}; //sendJSONResponse



_calculateRatings = function (playerOne, playerTwo, resultOfGame) {
  var odds = elo.bothExpectedScores(playerOne.rating, playerTwo.rating); // returns an array with odds[0] = playerOneOdds, and odds[1] = playerTwoOdds
  console.log("The odds of PlayerOne winning are about:", odds[0]);
  playerOne.rating = elo.newRating(odds[0], resultOfGame, playerOne.rating);
  playerTwo.rating = elo.newRating(odds[1], resultOfGame===1 ? 0 : 1, playerTwo.rating);
}



module.exports.createUser = function(req, res) {
  console.log(req.body);
  Users.create({
    _id: req.body.rfid,
    name: req.body.name.trim(),
    rating: 1200
  }, function(err, user) {
    if (!err) {
      sendJSONResponse(res, 201, user);
    } else {
      sendJSONResponse(res, 400, err);
    }
  });
}



module.exports.readUser = function (req,res) {
  if(req.body.rfid) {
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



module.exports.updateUserName = function (req,res) {
  if (!req.body.rfid) sendJSONResponse (res, 404, {message: "No RFID in request"});
  if (!req.body.name) sendJSONResponse (res, 404, {message: "No name in request"});
  Users
    .findById(req.body.rfid, function (err, user) {
      if (err) sendJSONResponse(res, 404, err);
      else if (!user) sendJSONResponse (res, 404, null);
      else {
        user.name = req.body.name
        user.save(function (err) {
          if (err) sendJSONResponse(res, 404, err);
          else sendJSONResponse (res, 200, user);
        });
      }
    });
};



module.exports.updateUserRatings = function (req, res) {
  var resultOfGame = playerOne.score>playerTwo.score ? 1 : 0;
  _calculateRatings(req.body.playerOne, req.body.playerTwo, resultOfGame);
  if (req.body.playerOne.user_id) {
    Users
      .findById(req.body.playerOne.user_id, function (err, user) {
        if (err) console.log(err);
        user.rating = req.body.playerOne.rating;
        user.gameCount += 1;
        if (resultOfGame === 1)       user.wins += 1;
        else if (resultOfGame === 0)  user.losses += 1;
        user.save();
      });
  }
  if (req.body.playerTwo.user_id) {
    Users
      .findById(req.body.playerTwo.user_id, function (err, user) {
        if (err) console.log(err);
        user.rating = req.body.playerTwo.rating;
        user.gameCount += 1;
        if (resultOfGame === 0)       user.wins += 1;
        else if (resultOfGame === 1)  user.losses += 1;
        user.save();
      });
  }
  sendJSONResponse(res, 201, null);
}
