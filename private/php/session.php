<?php
  include_once('dbconfig.php');

  session_start();

  if (!isset($_SESSION['login_user'])) {
    $user_check = $_COOKIE['login_user'];
  } else {
    $user_check = $_SESSION['login_user'];
  }

  $ses_sql = mysqli_query($db_link, "SELECT username FROM users WHERE username = '$user_check'");
  $row = mysqli_fetch_assoc($ses_sql);
  $login_session = $row['username'];
  if (!isset($login_session)) {
    echo "false";
  } else {
    echo "true";
  }
?>
