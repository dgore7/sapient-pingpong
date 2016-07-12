var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve('./app_server/views/index.html'));
});

router.get('/session', function(req, res, next) {
  res.send(true);
});

module.exports = router;
