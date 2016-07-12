var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');

// This is a utility function for sending response
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null,false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// TODO: break up
module.exports.registerUser = function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var pass1 = req.body.pass1;
  var pass2 = req.body.pass2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('pass1', 'Password is required').notEmpty();
  req.checkBody('pass2', 'Passwords do not match').equals(pass1);

  var errors = req.validationErrors();

  if (errors){
    res.render('register', { errors: errors});
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: pass1
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
      });
    });

    if(err) throw err;

    console.log(user);
    req.flash('success_msg', "You have been successfully registered.");

    res.redirect('/users/login');
  }
};

module.expoets.readUser = function(req, res) {
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    // TODO: change
    res.redirect('/');
  }
};

module.exports.getUserByID = function(req, res) {
  sendJsonResponse(res, 200, {status: "success", message: "ok"});
};

module.exports.send405Response = function(req, res) {
  sendJsonResponse(res, 405, {status: "fail", message: "method not allowed"});
}
