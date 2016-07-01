<?php
  include_once('dbconfig.php');

  session_start();

  // Quit if "Login" button was not clicked
  // if (!isset($_POST['login'])) {
  //   echo "foo";
  //   return;
  // }

  // Get raw username and password
  $username = $_POST['username'];
  $password = $_POST['password'];

  if (empty($username) || empty($password)) {
    echo "fail";
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
    $_SESSION['login_user'] = $username;
    // Load profile
    $file_name = "../public/xml/profile.html";
    $file = fopen($file_name, "r");
    $content = fread($file, filesize($file_name));
    echo $content;
  } else {
    echo "fail";
  }
?>
