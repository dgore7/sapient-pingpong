var express = require('express');
var router = express.Router();
var ctrlScoreboard = require('../controllers/scoreboard');
var game = require('../controllers/game');

router.post('/scoreboard/update-score', ctrlScoreboard.handleButtonPress);

module.exports = router;
