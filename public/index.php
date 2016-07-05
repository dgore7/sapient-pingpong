<?php
  switch($_GET['p']) {
    case "do-login":
      include("../private/php/login.php");
      break;
    case "do-logout":
      include("../private/php/logout.php");
      break;
    case "login":
      include("../private/php/index.php");
      break;
    case "session":
      include("../private/php/session.php");
      break;
    default:
      include("404.php");
      exit;
  }
?>
