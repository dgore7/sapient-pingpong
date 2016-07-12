var mongoose = require('mongoose');

// Game records
var gameSchema = mongoose.Schema({
  id: Number,                 // Unique game ID
  type: Number,               // Game type ID
  startTime: Date,
  endTime: Date,
  players: [
    {
      type: String,           // "registered" or "anonymous"
      id: Number,             // User ID if type == "registered", -1 otherwise
      score: Number
    }
  ]
});

// Game types
var gameTypeSchema = mongoose.Schema({
  id: Number,                 // Unique game type ID
  name: String,
  description: String,
  pointsToWin: Number,        // -1 for no limit
  winBy2: Boolean,
  timeLimitSeconds: Number,   // -1 for no limit
});
