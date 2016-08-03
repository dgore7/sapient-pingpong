var mongoose = require('mongoose');

var UserSchema = module.exports = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  name: String,
});



mongoose.model('User', UserSchema);
