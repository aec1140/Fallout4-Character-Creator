"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#characterMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#characterMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $("#characterMessage").animate({ width: 'hide' }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $("#characterMessage").animate({ width: 'hide' }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

var handleChangePassword = function handleChangePassword(e) {
  e.preventDefault();

  $("#characterMessage").animate({ width: 'hide' }, 350);

  if ($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("RAWR! Fill out all of the fields");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), function () {
    handleError("Password was changed!");
  });

  return false;
};

var renderLogin = function renderLogin() {
  return React.createElement(
    "form",
    { id: "loginForm",
      name: "loginForm",
      onSubmit: this.handleSubmit,
      action: "/login",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign In" })
  );
};

var renderSignup = function renderSignup() {
  return React.createElement(
    "form",
    { id: "signupForm",
      name: "signupForm",
      onSubmit: this.handleSubmit,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
  );
};

var renderChangePassword = function renderChangePassword() {
  return React.createElement(
    "form",
    { id: "changePassForm",
      name: "changePassForm",
      onSubmit: this.handleSubmit,
      action: "/changePass",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Old Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "old password" }),
    React.createElement(
      "label",
      { htmlFor: "newPass" },
      "New Password: "
    ),
    React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "new password" }),
    React.createElement(
      "label",
      { htmlFor: "newPass2" },
      "New Password: "
    ),
    React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "retype" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Change" })
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  var LoginWindow = React.createClass({
    displayName: "LoginWindow",

    handleSubmit: handleLogin,
    render: renderLogin
  });

  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  var SignupWindow = React.createClass({
    displayName: "SignupWindow",

    handleSubmit: handleSignup,
    render: renderSignup
  });

  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createChangePasswordWindow = function createChangePasswordWindow(csrf) {
  var ChangePasswordWindow = React.createClass({
    displayName: "ChangePasswordWindow",

    handleSubmit: handleChangePassword,
    render: renderChangePassword
  });

  ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var changePassButton = document.querySelector("#changePassButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createChangePasswordWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); //default view
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
