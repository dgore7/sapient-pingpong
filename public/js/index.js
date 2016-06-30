
var loaded = false;
var loader;

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

var addLoginButtonListener = function() {
  $("#login-btn").click(function (e) {
    e.preventDefault();
    loader.load("xml/profile.html");
  });
};


var addRegisterButtonListener = function () {
  console.log(('#register-btn'));
  $("#register-btn").click(function (e) {
    e.preventDefault();
  });
};
