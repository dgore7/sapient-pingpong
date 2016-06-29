// $(".container").append('<form class="login-form" action="" method="post"> <input type="text" name="username" value="" placeholder="username"> <input type="password" name="password" value="" placeholder="password"> <div class="form-btns"> <input id="login-btn" type="submit" name="login" value="Login"> <input id="signup-btn" type="submit" name="signup" value="Sign Up"> </div><span id="error"><?php echo $error; ?></span> </form>');
$("#signup-btn").click(function(e) {
  e.preventDefault();
  $(".login-form").hide();
  alert("it worked");
});
