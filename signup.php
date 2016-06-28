<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sapient Ping-Pong Signup</title>
    <link rel="stylesheet" href="styles.css" media="screen" title="no title" charset="utf-8">
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,900' rel='stylesheet' type='text/css'>
  </head>
  <body>
    <div class="container">
      <h2>Sapient</h2>
      <h3>Ping-Pong</h3>
      <form class="login-form" action="" method="post">
        <input type="text" name="username" value="" placeholder="username">
        <input type="password" name="password" value="" placeholder="password">
        <div class="form-btns">
          <input id="login-btn" type="submit" name="submit" value="Login">
          <input id="signup-btn" type="button" name="name" value="Sign Up">
        </div>
        <span><?php echo $error; ?></span>
      </form>
    </div>
  </body>
</html>
