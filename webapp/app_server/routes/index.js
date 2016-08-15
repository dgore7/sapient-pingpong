var router = require('express').Router();
var ctrl = require('../controllers/index');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/stats', function(req, res) {
  ctrl.getData(req,res);
});

module.exports = router;
