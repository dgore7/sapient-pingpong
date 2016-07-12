// TODO: This file needs heavy refactoring.
var express = require('express');
var router = express.Router();

var LocalStrategy = require('passport-local').Strategy

var User = require('../models/users');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  // res.render('register', { title: 'ASFR Project'});
  // res.sendFile(path.resolve('public/views/testing.html'));
});

router.get('/login', function(req, res, next) {
  // res.render('login', { title: 'ASFR Project'});
  // res.sendFile(path.resolve('public/views/testing.html'));
});

router.post('/register', users.registerUser);
router.post('/login', users.readUser);

// TODO: implement somewhere else at some place in time
// router.get('/logout', function(req, res){
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

module.exports = router;
