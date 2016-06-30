
var loaded = false;
var loader;

$(document).ready(function () {
  loader = $("#loader");
  if (!loaded) {
    loader.load("xml/index.html",function () {
      loaded= true;
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
      loader.load("xml/index.html",function () {
        addSignUpButtonListener();
        loader.animate({height:"toggle", opacity:1},function () {

        });
      });
    });
  });
};
