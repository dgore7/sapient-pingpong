<?php
  include_once('dbconfig.php');

  session_start();
  $error_msg = "";

  // Quit if "Login" button was not clicked
  if (!isset($_POST['login'])) {
    return;
  }

  // Get raw username and password
  $username = $_POST['username'];
  $password = $_POST['password'];

  if (empty($username) || empty($password)) {
    $error_msg = "Invalid username or password!";
    return;
  }

  // Sanitize username and password
  $username = mysqli_real_escape_string($db_link, stripslashes($username));
  $password = mysqli_real_escape_string($db_link, stripslashes($password));

  // Query database
  $query = sprintf("SELECT * FROM %s WHERE username = '%s' AND password = '%s' LIMIT 1",
      DB_USERS_TABLE, $username, $password);
  $result = mysqli_query($db_link, $query);
  $rows = mysqli_num_rows($result);

  // TODO: password hash check

  // Check for succesful login
  if ($rows == 1) {
    $error_msg = "Login success!";
  } else {
    $error_msg = "Invalid username or password!";
  }
?>
