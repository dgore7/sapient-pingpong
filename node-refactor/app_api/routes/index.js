var express = require('express');
var router = express.Router();
var users = require('../controllers/users');

// router.get('/users', users.getAllUsers);
router.post('/users', users.createUser);

router.get('/users/:userid', users.getUserByID);
router.post('/users/:userid', users.send405Response);

module.exports = router;
