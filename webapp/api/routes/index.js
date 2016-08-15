var express = require('express');
var router = express.Router();
var ctrlScoreboard = require('../controllers/scoreboard');
var ctrlGame = require('../controllers/game');
var ctrlUser = require('../controllers/user');

// scoreboard routes
router.post('/scoreboard/update-score', ctrlScoreboard.handleButtonPress);

router.get('/games', ctrlGame.readManyGames)
router.post('/games', ctrlGame.createGame);
router.post('/user/login', ctrlUser.readUser);
router.post('/user/register', ctrlUser.createUser);



module.exports = router;
