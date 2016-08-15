var mongoose = require('mongoose');
var games = mongoose.model("Game");

module.exports.getData = function(req,res) {
    console.log('made it here');
    games
        .find({})
        .sort({
            timestamp: -1
        })
        .exec(function(err, games) {
          for (var i = 0; i < games.length; i++) {
            games[i] = games[i].toObject();
          }
          res.render('data', {games: games});
        });
}
