var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/login', function(req, res, next) {
  res.sendFile(path.resolve('./app_server/views/html-snippets/login.html'));
});

router.get('/signup', function(req, res, next) {
  res.sendFile(path.resolve('./app_server/views/html-snippets/signup.html'));
});

router.get('/profile', function(req, res, next) {
  res.sendFile(path.resolve('./app_server/views/html-snippets/profile.html'));
});

module.exports = router;
