<?php
  include_once('dbconfig.php');

  function response_fail($message)
  {
    $response = array(
      "status" => "error",
      "message" => $message
    );
    echo json_encode($response);
  }


  /*  ===== main() ===== */

  session_start();

  // Get raw username and password
  $username = $_POST['username'];
  $password = $_POST['password'];

  if (empty($username) || empty($password)) {
    response_fail("Invalid username or password.");
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
  if ($rows != 1) {
    response_fail("Invalid username or password.");
    return;
  }

  // Set login cookie and session variable
  $far_in_the_future = pow(2, 31);
  setcookie("login_user", $username, $far_in_the_future, "/");
  $_SESSION['login_user'] = $username;


  $response = array(
    "status" => "success",
    "message" => "Login successful.",
    "user" => $username
  );
  echo json_encode($response);
?>
