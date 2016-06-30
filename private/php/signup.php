<?php
  include_once('dbconfig.php');

  session_start();
  $error_msg = "";

  // Quit if "Register" button was not clicked
  if (!isset($_POST['register'])) {
    return;
  }

  // Get raw username and password
  $username = $_POST['username'];
  $password = $_POST['password'];
  $password_confirm = $_POST['password-confirm'];

  if (empty($username) || empty($password) || empty($password_confirm)) {
    $error_msg = "Please enter a username and password.";
    return;
  }

  if (!($password === $password_confirm)) {
    $error_msg = "Passwords do not match!";
    return;
  }


?>
