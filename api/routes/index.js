var express = require('express');
var router = express.Router();
var ctrlScoreboard = require('../controllers/scoreboard');
var ctrlGame = require('../controllers/game');

// scoreboard routes
router.post('/scoreboard/update-score', ctrlScoreboard.handleButtonPress);

router.post('/games', ctrlGame.createGame);

module.exports = router;
