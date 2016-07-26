var mongoose = require('mongoose');
var games = mongoose.model("Game");


var sendJSONResponse = function (res,status,content) {
  res.status(status);
  res.json(content);
}; //sendJSONResponse

module.exports.createGame = function(req, res) {
  games.create({
    timestamp: req.body.timestamp,
    duration: req.body.duration,
    score: req.body.score
  }, function(err, game) {
    if (!err) {
      sendJSONResponse(res, 201, game);
    } else {
      sendJSONResponse(res, 400, err);
    }
  });
}
