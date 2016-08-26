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
require('../models/game');
var games = mongoose.model("Game");
var ctrlUser = require('./user.js');


var sendJSONResponse = function (res,status,content) {
  res.status(status);
  res.json(content);
}; //sendJSONResponse


module.exports.createGame = function(req, res) {
  games.create({
    timestamp: req.body.timestamp,
    duration: req.body.duration,
    playerOne: req.body.playerOne,
    playerTwo: req.body.playerTwo,
  }, function(err, game) {
    if (!err) {
      ctrlUser.updateUserRatings(req, res);
    } else {
      sendJSONResponse(res, 400, err);
    }
  });

}



module.exports.readManyGames = function(req, res) {
  games
    .find({})
    .sort({timestamp:-1})
    .exec(function (err, games) {
      if (err) {
        console.log(err);
        sendJSONResponse(res, 404, err);
      }
      sendJSONResponse(res, 200, games);
    });
  // sendJSONResponse(res, 404, {message: "idk what happened"});
}
