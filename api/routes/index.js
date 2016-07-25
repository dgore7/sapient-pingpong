var express = require('express');
var router = express.Router();
var scoreboardAPI = require('../controllers/scoreboard');
var game = require('../controllers/game');

router.use('/scoreboard', scoreboardAPI);

module.exports = router;
