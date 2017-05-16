const handleLogin = (e) => {
  e.preventDefault();

  $("#characterMessage").animate({width:'hide'},350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
      handleError("RAWR! Username or password is empty");
      return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  $("#characterMessage").animate({width:'hide'},350);

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

const handleChangePassword = (e) => {
  e.preventDefault();

  $("#characterMessage").animate({width:'hide'},350);

  if ($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
      handleError("RAWR! Fill out all of the fields");
      return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
      handleError("RAWR! Passwords do not match");
      return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), function() {
    handleError("Password was changed!")
  });

  return false;
};

const renderLogin = function() {
  return (
    <form id="loginForm"
        name="loginForm"
        onSubmit={this.handleSubmit}
        action="/login"
        method="POST"
        className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username"/>
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="formSubmit" type="submit" value="Sign In" />
    </form>
  );
};

const renderSignup = function() {
  return (
  <form id="signupForm"
      name="signupForm"
      onSubmit={this.handleSubmit}
      action="/signup"
      method="POST"
      className="mainForm"
  >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username"/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password"/>
    <label htmlFor="pass2">Password: </label>
    <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
    <input type="hidden" name="_csrf" value={this.props.csrf} />
    <input className="formSubmit" type="submit" value="Sign Up" />
  </form>
  );
};

const renderChangePassword = function() {
  return (
  <form id="changePassForm"
      name="changePassForm"
      onSubmit={this.handleSubmit}
      action="/changePass"
      method="POST"
      className="mainForm"
  >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username"/>
    <label htmlFor="pass">Old Password: </label>
    <input id="pass" type="password" name="pass" placeholder="old password"/>
    <label htmlFor="newPass">New Password: </label>
    <input id="newPass" type="password" name="newPass" placeholder="new password"/>
    <label htmlFor="newPass2">New Password: </label>
    <input id="newPass2" type="password" name="newPass2" placeholder="retype"/>
    <input type="hidden" name="_csrf" value={this.props.csrf} />
    <input className="formSubmit" type="submit" value="Change" />
  </form>
  );
};

const createLoginWindow = function(csrf) {
  const LoginWindow = React.createClass({
    handleSubmit: handleLogin,
    render: renderLogin
  });

  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createSignupWindow = function (csrf) {
  const SignupWindow = React.createClass({
    handleSubmit: handleSignup,
    render: renderSignup
  });

  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createChangePasswordWindow = function (csrf) {
  const ChangePasswordWindow = React.createClass({
    handleSubmit: handleChangePassword,
    render: renderChangePassword
  });

  ReactDOM.render(
    <ChangePasswordWindow csrf={csrf} />,
    document.querySelector("#content")
  );
}

const setup = function(csrf) {
  const loginButton = document.querySelector("#loginButton");
  const changePassButton = document.querySelector("#changePassButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  changePassButton.addEventListener("click", (e) => {
    e.preventDefault();
    createChangePasswordWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); //default view
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
