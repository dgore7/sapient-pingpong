<?php
  include_once('dbconfig.php');

  session_start();  

  $user_check = $_SESSION['login_user'];
  $ses_sql = mysqli_query($db_link, "SELECT username FROM login WHERE username = '$user_check'");
  $row = mysqli_fetch_assoc($ses_sql);
  $login_session = $row['username'];
  if (!isset($login_session)) {
    header('location: index.php');
  }
?>