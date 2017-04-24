let characterRenderer; // Character Renderer Component
let characterForm; // Character Add Form Render Component
let CharacterFormClass; // Character Form React UI Class
let CharacterListClass; // Character List React UI Class

const handleCharacter = (e) => {
  e.preventDefault();

  $("#characterMessage").animate({width:'hide'},350);
  if ($("#characterName").val() == '' || $("#characterSex").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
  }
  sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function() {
    characterRenderer.loadCharactersFromServer();
  });

  return false;
};

const deleteCharacter = function(e) {
  sendAjax('POST', '/deleteCharacter', $("#characterForm").serialize() + '&id=' + e.target.id, function() {
    characterRenderer.loadCharactersFromServer();
  });
};

// const updateCharacter = function(e) {
//   sendAjax('POST', '/updateCharacter', $("#characterForm").serialize() + '&id=' + e.target.id, function() {
//     characterRenderer.loadCharactersFromServer();
//   });
// };

const selectCharacter = function(e) {
  sendAjax('GET', `/characters/${e.target.getAttribute('name')}`, $("#characterForm").serialize() + '&id=' + e.target.id, redirect);
};

const renderCharacterPreview = function() {
  return (
    <form id="characterForm"
        name="characterForm"
        onSubmit={this.handleSubmit}
        action="/characters"
        method="POST"
        className="characterForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="characterName" type="text" name="name" placeholder="Character Name"/>
      <label htmlFor="sex">Sex: </label>
      <select id="characterSex" name="sex">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="makeCharacterSubmit" type="submit" value="Create" />
    </form>
  );
};

const renderCharacterList = function() {
  if (this.state.data.length === 0) {
    return (
      <div className="characterList">
        <h3 className="emptyCharacter">No Characters yet</h3>
      </div>
    );
  }

  const characterNodes = this.state.data.map(function(character) {
    return (
      <div key={character._id} className="character" name={character.name} id={character._id} onClick={this.handleClick}>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="characterName"> Name: {character.name} </h3>
        <h3 className="characterSex"> Sex: {character.sex} </h3>
        <h3 className="characterLevel"> Level: {character.level} </h3>
        <button onClick={this.handleDelete} id={character._id}>Delete</button>
      </div>
    );
  }.bind(this));

  return (
    <div className="characterList">
      {characterNodes}
    </div>
  );
};

const setup = function(csrf) {
  CharacterFormClass = React.createClass({
    handleSubmit: handleCharacter,
    render: renderCharacterPreview,
  });

  CharacterListClass = React.createClass({
    loadCharactersFromServer: function() {
      sendAjax('GET', '/getCharacters', null, function(data) {
        this.setState({ data:data.characters });
      }.bind(this));
    },
    getInitialState: function() {
      return { data: [] };
    },
    handleDelete: deleteCharacter,
    handleClick: selectCharacter,
    componentDidMount: function() {
      this.loadCharactersFromServer();
    },
    render: renderCharacterList,
  });

  characterForm = ReactDOM.render(
    <CharacterFormClass csrf={csrf} />, document.querySelector("#makeCharacter")
  );

  characterRenderer = ReactDOM.render(
    <CharacterListClass csrf={csrf} />, document.querySelector("#characters")
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
