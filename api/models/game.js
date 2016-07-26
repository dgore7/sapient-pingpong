var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  timestamp: Number,
  duration: Number,
  score: [Number]
});

mongoose.model('Game', gameSchema);
