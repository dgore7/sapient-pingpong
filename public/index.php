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
    case "profile":
      include("../private/php/profile.php");
      break;
    default:
      include("404.php");
      exit;
  }
?>