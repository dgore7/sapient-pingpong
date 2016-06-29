<?php
  switch($_GET['p']) {
    case "login":
      include("../private/php/index.php");
      break;
    case "logout":
      include("../private/php/logout.php");
      break;
    case "profile":
      include("../private/php/profile.php");
      break;
    case "signup":
      include("../private/php/signup.php");
      break;
    default:
      include("404.php");
      exit;
  }
?>