<?php
  include('login.php');
  include('signup.php');

  if (isset($_SESSION['login_user'])) {
      header('location: profile');
  }
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sapient Ping-Pong</title>
    <link rel="stylesheet" href="/css/styles.css" media="screen" title="no title" charset="utf-8">
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,900' rel='stylesheet' type='text/css'>
  </head>
  <body>
    <div class="container">
      <h2>Sapient</h2>
      <h3>Ping-Pong</h3>
      <div id="loader">

      </div>
      <p id="error"><?php echo $error_msg; ?></p>
      <script src="https://code.jquery.com/jquery-3.0.0.min.js" integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0=" crossorigin="anonymous"></script>
      <script type="text/javascript" src="/js/index.js"></script>
    </div>
  </body>
</html>
