var mongoose = require('mongoose');

var GameSchema = module.exports = new mongoose.Schema({
  timestamp: Number,
  duration: Number,
  score: [Number]
  // playerOne: {
  //   user_id: Number,
  //   score: Number
  // },
  // playerTwo: {
  //   user_id: Number,
  //   score: Number
  // }
});


var playerSchema = new mongoose.Schema({
  user_id: Number,
  score: Number
});


mongoose.model('Game', GameSchema);
