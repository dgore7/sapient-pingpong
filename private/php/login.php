<?php
  include_once('dbconfig.php');

  session_start();
  $error = '';

  // Quit if "Login" button was not clicked
  if (isset($_POST['signup'])) {
    header('location: signup.php');
    return;
  }
  if (!isset($_POST['login'])) {
    return;
  }

  // Attempt to log in if "username" and "password" fields are not empty
  if (!empty($_POST['username']) && !empty($_POST['password'])) {
    $username = mysqli_real_escape_string($db_link, stripslashes($_POST['username']));
    $password = mysqli_real_escape_string($db_link, stripslashes($_POST['password']));

    $result = mysqli_query($db_link, "SELECT * FROM login WHERE username = '$username' AND password = '$password'");
    $rows = mysqli_num_rows($result);

    if ($rows == 1) {
      // Login successful!
      $_SESSION['login_user'] = $username;
      header('location: profile.php');
    } else {
      $error = "Invalid username or password!";
    }
  } else {
    $error = "Invalid username or password!";
  }
?>