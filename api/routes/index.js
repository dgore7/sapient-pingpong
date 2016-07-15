var express = require('express');
var router = express.Router();
var gameAPI = require('../controllers/game');

router.use('/game', gameAPI);

module.exports = router;
