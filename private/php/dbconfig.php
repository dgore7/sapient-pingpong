<?php
  define('DB_SERVER', 'localhost');
  define('DB_USERNAME', 'root');
  define('DB_PASSWORD', 'sapient');
  define('DB_DATABASE', 'pingpong');
  define('DB_USERS_TABLE', 'users');
  define('DB_STATS_TABLE', 'stats');
  $db_link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
?>
