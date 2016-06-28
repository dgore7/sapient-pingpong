<?php
  session_start();

  $error = '';

  if (!isset($_POST['submit'])) {
    return;
  }

  if (!empty($_POST['username']) && !empty($_POST['password'])) {
    $link = mysqli_connect("localhost", "root", "sapient", "pingpong");

    $username = mysqli_real_escape_string($link, stripslashes($_POST['username']));
    $password = mysqli_real_escape_string($link, stripslashes($_POST['password']));

    $result = mysqli_query($link, "select * from login where username = '$username' AND password = '$password'");
    $rows = mysqli_num_rows($result);

    if ($rows == 1) {
      $_SESSION['login_user'] = $username;
      header('location: profile.php');
    } else {
      $error = "Invalid username or password!";
    }

    mysqli_close($link);
  } else {
    $error = "Invalid username or password!";
  }
