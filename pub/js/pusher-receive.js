const PUSHER_KEY = '7478bf1c2d89d2efb9b0';

var pusher = new Pusher(PUSHER_KEY, {
  cluster: 'eu',
  encrypted: true
});

var channel = pusher.subscribe('scoreboard');
channel.bind('update-score', function(data) {
  // Do something with data
  console.log(data);
});
