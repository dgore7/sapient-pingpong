var mongoose = require('mongoose');
require('../models/game')
var games = mongoose.model("Game");


var sendJSONResponse = function (res,status,content) {
  res.status(status);
  res.json(content);
}; //sendJSONResponse

module.exports.createGame = function(req, res) {
  games.create({
    timestamp: req.body.timestamp,
    duration: req.body.duration,
    score: req.body.score,
    playerOne: req.body.playerOne,
    playerTwo: req.body.playerTwo,
  }, function(err, game) {
    if (!err) {
      sendJSONResponse(res, 201, game);
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
