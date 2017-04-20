"use strict";

var characterRenderer = void 0; // Character Renderer Component
var characterForm = void 0; // Character Add Form Render Component
var CharacterFormClass = void 0; // Character Form React UI Class
var CharacterListClass = void 0; // Character List React UI Class

var handleCharacter = function handleCharacter(e) {
  e.preventDefault();

  $("#characterMessage").animate({ width: 'hide' }, 350);
  if ($("#characterName").val() == '' || $("#characterSex").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function () {
    characterRenderer.loadCharactersFromServer();
  });

  return false;
};

var deleteCharacter = function deleteCharacter(e) {
  sendAjax('POST', '/deleteCharacter', $("#characterForm").serialize() + '&id=' + e.target.id, function () {
    characterRenderer.loadCharactersFromServer();
  });
};

var renderCharacterPreview = function renderCharacterPreview() {
  return React.createElement(
    "form",
    { id: "characterForm",
      name: "characterForm",
      onSubmit: this.handleSubmit,
      action: "/characters",
      method: "POST",
      className: "characterForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "characterName", type: "text", name: "name", placeholder: "Character Name" }),
    React.createElement(
      "label",
      { htmlFor: "sex" },
      "Sex: "
    ),
    React.createElement(
      "select",
      { id: "characterSex", name: "sex" },
      React.createElement(
        "option",
        { value: "Male" },
        "Male"
      ),
      React.createElement(
        "option",
        { value: "Female" },
        "Female"
      )
    ),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "makeCharacterSubmit", type: "submit", value: "Create" })
  );
};

var renderCharacterList = function renderCharacterList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "characterList" },
      React.createElement(
        "h3",
        { className: "emptyCharacter" },
        "No Characters yet"
      )
    );
  }

  var characterNodes = this.state.data.map(function (character) {
    return React.createElement(
      "div",
      { key: character._id, className: "character", onClick: this.handleDelete },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
      React.createElement(
        "h3",
        { className: "characterName" },
        " Name: ",
        character.name,
        " "
      ),
      React.createElement(
        "h2",
        { className: "characterSex" },
        " Sex: ",
        character.sex,
        " "
      ),
      React.createElement(
        "h2",
        { className: "characterLevel" },
        " Level: ",
        character.level,
        " "
      ),
      React.createElement(
        "button",
        { onClick: this.handleDelete, id: character._id },
        "Delete"
      )
    );
  }.bind(this));

  return React.createElement(
    "div",
    { className: "characterList" },
    characterNodes
  );
};

var setup = function setup(csrf) {
  CharacterFormClass = React.createClass({
    displayName: "CharacterFormClass",

    handleSubmit: handleCharacter,
    render: renderCharacterPreview
  });

  CharacterListClass = React.createClass({
    displayName: "CharacterListClass",

    loadCharactersFromServer: function loadCharactersFromServer() {
      sendAjax('GET', '/getCharacters', null, function (data) {
        this.setState({ data: data.characters });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    handleDelete: deleteCharacter,
    componentDidMount: function componentDidMount() {
      this.loadCharactersFromServer();
    },
    render: renderCharacterList
  });

  characterForm = ReactDOM.render(React.createElement(CharacterFormClass, { csrf: csrf }), document.querySelector("#makeCharacter"));

  characterRenderer = ReactDOM.render(React.createElement(CharacterListClass, { csrf: csrf }), document.querySelector("#characters"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
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
