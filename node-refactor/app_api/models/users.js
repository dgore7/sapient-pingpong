var mongoose = require('mongoose');

// User schema
var userSchema = mongoose.Schema({
  id: Number,               // Unique user ID
  username: String,
  password: String,
  email: String,
  createdOn: {
    type: Date,
    "default": Date.now
  },
  profilePic: String,       // Base64 string
  stats: {
    wins: Number,
    losses: Number,
    gamesPlayed: [Number],  // IDs of games played
    timeLastPlayed: Date
  }
});

// User Model
var User = module.exports = mongoose.model('User', userSchema);

// // User Creation
// module.exports.createUser = function(newUser, callback) {
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(newUser.password, salt, function(err, hash) {
//       newUser.password = hash;
//       newUser.save(callback);
//     });
//   });
// }
//
// // User query by username
// module.exports.getUserByUsername = function(username, callback){
//   var query = {username: username};
//   User.findOne(query, callback);
// };
//
// // Password comparison utility method
// module.exports.comparePassword = function(candidatePassword, hash, callback) {
//   bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     if (err) throw err;
//     callback(null, isMatch);
//   });
// };
//
// // User query by id
// module.exports.getUserById = function(id,callback) {
//   User.findById(id, callback);
// };
