var loaded = false;
var loader;
var optionsForm;

/* Entry point. */
$(document).ready(function () {
  loader = $("#loader");

  // Quit if page already loaded
  if (loaded) {
    return;
  }

  // Get session status and decide which page to load
  $.ajax({
    type: 'GET',
    url: 'session',
    success: function(response) {
      if (response === "true") {
        loadProfile();
      } else {
        // Load login page
        animatePage("xml/login.html",
            [ addLoginButtonListener, addSignUpButtonListener ]);
      }
      loaded = true;
    }
  });
});

/* ====== HELPER FUNCTIONS ====== */

/* If form passes verification submit form and proceed to login */
var submitLoginForm = function() {
  var data = $("#login-form").serialize();
  $.ajax({
    type: 'POST',
    url: 'do-login',
    data: data,
    success: function(response) {
      if (response === "false") {
        // Login failure condition
        $("#error").html("<p>Invalid username or password!</p>");
      } else {
        // Succesful login condition
        $("#error").html("");
        loadProfile();
      }
    }
  });
};

var loadProfile = function() {
  loader.animate(
    {height: "toggle", opacity: 0.25},
    function() {
      loader.load("xml/profile.html", function() {
        optionsForm = $("#options-form");
        addOptionsButtonListener();
        // TODO: addReadyButtonListener();
        optionsForm.toggle();
        loadProfilePic();
      });
    }
  );
};

var loadProfilePic = function() {
  var img = $("#profile-pic");
  img.one("load", function() {
    loader.animate({ height: "toggle", width: "toggle", opacity: 1 });
  });
};

var animatePage = function(pageToLoad, listeners) {
  var closeOptions = { height: "toggle", width: "toggle", opacity: 0.25 };
  var openOptions = { height: "toggle", width: "toggle", opacity: 1 };
  loader.animate(closeOptions, function() {
    loader.load(pageToLoad, function() {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
      loader.animate(openOptions);
    });
  });
};

/* ====== BUTTON LISTENERS ====== */

/* --- login page --- */
var addLoginButtonListener = function() {
  $("#login-btn").click(function (e) {
    $("#login-form").validate({
      submitHandler: submitLoginForm
    });
  });
};

var addSignUpButtonListener = function() {
  $("#signup-btn").click(function(evt) {
    evt.preventDefault();
    animatePage("xml/signup.html",
        [ addBackButtonListener, addRegisterButtonListener ]);
  });
};

/* --- signup page --- */
var addBackButtonListener = function() {
  $("#back-btn").click(function(evt) {
    evt.preventDefault();
    animatePage("xml/login.html", [ addSignUpButtonListener ]);
  });
};

var addRegisterButtonListener = function () {
  console.log($('#register-btn'));
  $("#register-btn").click(function (e) {
    e.preventDefault();
  });
};

/* --- profile page --- */
var addOptionsButtonListener = function() {
  $("#options-btn").click(function(e) {
    optionsForm.animate({height:"toggle",opacity:1});
  });
};
