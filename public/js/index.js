var loaded = false;
var loader;
var optionsForm;

$(document).ready(function () {
  loader = $("#loader");
  if (!loaded) {
    loader.load("xml/login.html",function () {
      loaded= true;
      addLoginButtonListener();
      addSignUpButtonListener();
    });
  }
});

/* login page */
var addLoginButtonListener = function() {
  $("#login-btn").click(function (e) {
    // e.preventDefault();
    $("#login-form").validate({
      submitHandler: submitForm
    });
  });
};

function submitForm() {
  /* if form passes verification submit form
     and proceed to login */
  var data = $("#login-form").serialize();
  $.ajax({
    type: 'POST',
    url: 'do-login',
    data: data,
    success: function(response) {
      if (response == "fail") { // Login failure condition
        console.log("Login fail!");
        $("#error").html("<p>Invalid username or password!</p>");
      } else { // Succesful login condition
        console.log(response);
        loader.animate({height: "toggle", opacity: 0.25}, function () {
          loader.html(response);
          optionsForm = $("#options-form");
          optionsForm.toggle();
          $("#profile-pic").one("load", function() {
            // wait for image to load before animation
            loader.animate({height: "toggle", opacity: 1});// do stuff
          });
          addOptionsButtonListener();
        });

      }
    }
  });
  return false;
}

var addSignUpButtonListener = function() {
  $("#signup-btn").click(function(e) {
    e.preventDefault();
    loader.animate({
      height:"toggle",
      opacity: 0.25
    },function () {
      loader.load("xml/signup.html",function () {
        addBackButtonListener();
        addRegisterButtonListener();
        loader.animate({height:"toggle", opacity:1},function () {

        });
      });
    });
  });
};
/*=======================================*/

/* signup page */
var addBackButtonListener = function() {
  $("#back-btn").click(function(evt) {
    evt.preventDefault();
    loader.animate({
      height:"toggle",
      opacity: 0.25
    },function () {
      loader.load("xml/login.html",function () {
        addSignUpButtonListener();
        loader.animate({height:"toggle", opacity:1});
      });
    });
  });
};
var addRegisterButtonListener = function () {
  console.log($('#register-btn'));
  $("#register-btn").click(function (e) {
    e.preventDefault();
  });
};
/*=======================================*/

/* profile page */
var addOptionsButtonListener = function() {
  $("#options-btn").click(function(e) {
    optionsForm.animate({height:"toggle",opacity:1});
  });
};
/*=======================================*/
