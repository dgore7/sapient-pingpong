var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var secret = require('../../secret');

var debounce = false;

// Initialize physical push-button actions
// TODO: use map instead?
var buttonActions = {
  single: 'increment-score',
  double: 'decrement-score',
  hold: 'end-game'
};

// Initialize Pusher
var pusher = new Pusher({
  appId: '225891',
  key: '7478bf1c2d89d2efb9b0',
  secret: secret.pusher,
  cluster: 'eu',
  encrypted: true
});

function onMessage(scoreData, res) {
  if (!debounce) {
    debounce = true;
    pusher.trigger('scoreboard', 'update-score', scoreData);
    res.json({status: 'ok', message: 'transmit success'});

    setTimeout(function() {
      debounce = false;
    }, 1000);
  }
}

/*
 * Checks whether data sent from the physical push-button is valid.
 */
function validateButtonData(data) {
  if (data == null) {
    return false;
  }

  // Check fields
  if (!data.hasOwnProperty('button') || !data.hasOwnProperty('clickType')) {
    console.log("missing field");
    return false;
  }

  // Check button value
  if (data.button != 1 && data.button != 2) {
    console.log("invalid button");
    return false;
  }

  // Check click type
  if (!(data.clickType in buttonActions)) {
    console.log("action not found");
    return false;
  }

  return true;
}

/*
 * Interprets data sent from push-button, then sends a request via pusher
 * containing the action to perform on the scoreboard.
 */
function handleButtonPress(req, res) {
  res.type('json');
  console.log(req.body);

  var data = req.body;

  if (!validateButtonData(data)) {
    res.json({status: 'error', message: 'invalid data'});
    res.end();
    return;
  }

  var scoreData = {
    player: data.button,
    action: buttonActions[data.clickType]
  }

  console.log(scoreData);
  onMessage(scoreData, res);
  res.end();
}

// Handle PUT from push-buttons
router.put('/scoreboard', function(req, res) {
  handleButtonPress(req, res);
});

module.exports = router;
