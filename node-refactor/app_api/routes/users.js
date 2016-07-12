// TODO: This file needs heavy refactoring.
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

var User = require('../models/users');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'ASFR Project'});
  // res.sendFile(path.resolve('public/views/testing.html'));
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'ASFR Project'});
  // res.sendFile(path.resolve('public/views/testing.html'));
});

router.post('/register', function(req, res, next) {
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

    User.createUser(newUser, function (err, user) {
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', "You have been successfully registered.");

    res.redirect('/users/login');
  }
});

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


router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/users/login');
});

module.exports = router;
