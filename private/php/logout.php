<?php
  session_start();
  unset($_SESSION['login_user']);
  unset($_COOKIE['login_user']);
  setcookie("login_user", null, -1, "/");
  
  if(session_destroy()) {
    header('location: login');
  }
?>
