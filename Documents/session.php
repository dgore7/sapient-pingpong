<?php
  $link = mysqli_connect("localhost", "root", "sapient", "pingpong");
  session_start();  

  $user_check = $_SESSION['login_user'];
  $ses_sql = mysqli_query($link, "select username from login where username = '$user_check'");
  $row = mysqli_fetch_assoc($ses_sql);
  $login_session = $row['username'];
  if (!isset($login_session)) {
    mysqli_close($link);
    header('location: index.php');
  }
?>