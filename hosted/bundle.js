"use strict";

var characterRenderer = void 0; // Character Renderer Component
var characterForm = void 0; // Character Add Form Render Component
var CharacterFormClass = void 0; // Character Form React UI Class
var CharacterListClass = void 0; // Character List React UI Class

var handleCharacter = function handleCharacter(e) {
  e.preventDefault();

  $("#characterMessage").animate({ width: 'hide' }, 350);
  if ($("#characterName").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function () {
    characterRenderer.loadCharactersFromServer();
  });

  return false;
};

var deleteCharacter = function deleteCharacter(e) {
  if (!confirm("Do you want to delete " + e.target.name + "?")) return;

  sendAjax('POST', '/deleteCharacter', $("#specialForm").serialize(), function () {
    characterRenderer.loadCharactersFromServer();
  });
};

var updateCharacter = function updateCharacter(e) {
  sendAjax('POST', '/updateCharacter', $("#specialForm").serialize(), function () {
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
    var maxPoints = 28;
    var totalPoints = character.strength + character.perception + character.endurance + character.charisma + character.intelligence + character.agility + character.luck;
    var remainingPoints = maxPoints - totalPoints;
    return React.createElement(
      "div",
      { key: character._id, className: "character", name: character.name, id: character.name },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
      React.createElement(
        "button",
        { onClick: this.handleDelete, name: character.name, className: "deleteButton" },
        "X"
      ),
      React.createElement(
        "h3",
        { className: "characterName" },
        " Name: ",
        character.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "characterLevel" },
        " Level: ",
        character.level,
        " "
      ),
      React.createElement(
        "div",
        { className: "characterSpecial" },
        React.createElement(
          "h4",
          { className: "characterSpecial" },
          " Special: "
        ),
        React.createElement(
          "h5",
          null,
          "Special - ",
          React.createElement(
            "i",
            null,
            "Points Remaining: ",
            remainingPoints
          )
        ),
        React.createElement(
          "form",
          { id: "specialForm",
            onChange: this.handleChange,
            name: "specialForm",
            action: "/updateCharacter",
            method: "POST",
            className: "specialForm"
          },
          React.createElement(
            "table",
            { className: "specialStats" },
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Strength"
              ),
              React.createElement(
                "td",
                null,
                React.createElement("input", { id: "strength", type: "number", name: "strength", min: "1", max: "10", value: character.strength })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Perception"
              ),
              React.createElement(
                "td",
                null,
                React.createElement("input", { id: "perception", type: "number", name: "perception", min: "1", max: "10", value: character.perception })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Endurance"
              ),
              React.createElement(
                "td",
                null,
                React.createElement("input", { id: "endurance", type: "number", name: "endurance", min: "1", max: "10", value: character.endurance })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Charisma"
              ),
              React.createElement(
                "td",
                null,
                React.createElement("input", { id: "charisma", type: "number", name: "charisma", min: "1", max: "10", value: character.charisma })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Intelligence"
              ),
              React.createElement(
                "td",
                null,
                React.createElement("input", { id: "intelligence", type: "number", name: "intelligence", min: "1", max: "10", value: character.intelligence })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Agility"
              ),
              React.createElement(
                "td",
                null,
                React.createElement("input", { id: "agility", type: "number", name: "agility", min: "1", max: "10", value: character.agility })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Luck"
              ),
              React.createElement(
                "td",
                null,
                React.createElement("input", { id: "luck", type: "number", name: "luck", min: "1", max: "10", value: character.luck })
              )
            )
          ),
          React.createElement(
            "table",
            { className: "playerStats" },
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Hit Points"
              ),
              React.createElement(
                "th",
                null,
                "Action Points"
              ),
              React.createElement(
                "th",
                null,
                "Carry Weight"
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                character.hitPoints
              ),
              React.createElement(
                "td",
                null,
                character.actionPoints
              ),
              React.createElement(
                "td",
                null,
                character.carryWeight
              )
            )
          ),
          React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
          React.createElement("input", { type: "hidden", name: "_id", value: character._id }),
          React.createElement("input", { type: "hidden", name: "remainingPoints", value: remainingPoints }),
          React.createElement("input", { type: "hidden", name: "name", value: character.name })
        )
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
    handleChange: updateCharacter,
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
