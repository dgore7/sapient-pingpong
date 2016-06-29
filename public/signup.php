<?php
  include_once('dbconfig.php');
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sapient Ping-Pong Signup</title>
    <link rel="stylesheet" href="css/styles.css" media="screen" title="no title" charset="utf-8">
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,900' rel='stylesheet' type='text/css'>
  </head>
  <body>
    <div class="container">
      <h2>Sapient</h2>
      <h3>Ping-Pong</h3>
      <form class="login-form" action="index.php" method="get">
        <input type="text" name="username" value="" placeholder="username">
        <input type="password" name="password" value="" placeholder="password">
        <input type="password" name="password-confirm" value="" placeholder="confirm password">
        <div class="form-btns">
          <button id="back-btn" onclick="window.location.href='index.php'">&lt; Back</button>
          <input id="signup-btn" type="submit" name="signup" value="Sign Up">
        </div>
        <span id="error"><?php echo $error; ?></span>
      </form>
    </div>
  </body>
</html>