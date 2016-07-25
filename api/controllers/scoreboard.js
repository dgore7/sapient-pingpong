var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var secret = require('../../secret');

var debounce = false;
var timeout = null;
const delay= 1500;

// Initialize Pusher
var pusher = new Pusher({
  appId: '225891',
  key: '45a78a912c58902f2b95',
  secret: secret.pusher,
  cluster: 'eu',
  encrypted: true
});

/*
 * Sends data to the frontend via Pusher.
 */
function sendData(scoreData) {
  var sent = false;

  // Only send if debouncer is not currently running.
  if (!debounce) {
    debounce = true;
    pusher.trigger('scoreboard', 'update-score', scoreData);
    sent = true;
  }

  // Start debouncer.
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    debounce = false;
  }, delay);

  return sent;
}

/*
 * Checks whether data sent from the physical push-button is valid.
 */
function validateButtonData(data) {
  if (data == null) {
    return { status: 'error', message: 'no data' };
  }

  // Check fields
  if (!data.hasOwnProperty('button') || !data.hasOwnProperty('clickType')) {
    return { status: 'error', message: 'missing field' };
  }

  // Check button value
  if (data.button != 1 && data.button != 2) {
    return { status: 'error', message: 'invalid button number' };
  }

  return { status: 'ok' };
}

/*
 * Interprets data sent from push-button, then sends a request via Pusher
 * containing the action to perform on the scoreboard.
 */
module.exports.handleButtonPress = function(req, res) {
  res.type('json');
  console.log(req.body);

  var data = req.body;

  var validationResult = validateButtonData(data);
  if (validationResult.status != 'ok') {
    console.log(validationResult);
    res.json(validationResult);
    res.end();
    return;
  }

  console.log(data);
  var hasSent = sendData(data);

  if (hasSent) {
    res.json({ status: 'ok', message: 'transmit success' });
  } else {
    res.json({ status: 'error', message: 'transmit unsuccessful - debounce' });
  }

  res.end();
}
