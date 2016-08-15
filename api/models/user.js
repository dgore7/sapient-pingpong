var mongoose = require('mongoose');

var UserSchema = module.exports = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    min: [1, "name field is too short"],
    max: [32, "name field is too long"]
  }
});



mongoose.model('User', UserSchema);
