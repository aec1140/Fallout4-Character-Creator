let characterListRenderer; // Character List Renderer Component
let characterForm; // Character Add Form Render Component
let characterRenderer; // Character Renderer Component
let CharacterFormClass; // Character Form React UI Class
let CharacterListClass; // Character List React UI Class
let CharacterClass; // Character React UI Class

// handles the submit of a new character and loads them
const handleCharacter = (e) => {
  e.preventDefault();

  $("#characterMessage").animate({width:'hide'},350);
  if ($("#characterName").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
  }
  sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function() {
    characterListRenderer.loadCharactersFromServer();
  });

  return false;
};

// handles onclick events and loads a character when selected
const selectCharacter = function(e) {
  e.preventDefault();

  let id = null;

  const children = e.target.childNodes;

  for (let i = 0; i < children.length; ++i) {
    if (children[i].className == "_id") {
      id = children[i].value;
      break;
    }
  }

  if (id != null) {
    characterRenderer.loadCharacterFromServer($("#characterForm").serialize() + `&_id=${id}`);
  }

  return false;
}

// deletes a character from the server
const deleteCharacter = function(e) {
  if (!confirm(`Do you want to delete ${e.target.name}?`)) return;

  let id = null;

  const parent = e.target.parentElement;
  const children = parent.childNodes;

  for (let i = 0; i < children.length; ++i) {
    if (children[i].className == "_id") {
      id = children[i].value;
      break;
    }
  }

  sendAjax('POST', '/deleteCharacter', $("#characterForm").serialize() + `&_id=${id}`, function() {
    characterListRenderer.loadCharactersFromServer();
  });
};

// handles onchange events when the character is seleceted
const updateCharacter = function(e) {
  sendAjax('POST', '/updateCharacter', $("#specialForm").serialize(), function() {
    characterRenderer.loadCharacterFromServer($("#specialForm").serialize());
  });
};

// renderer for character creator
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
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="makeCharacterSubmit" type="submit" value="Create" />
    </form>
  );
};

// renderer for selected character
const renderCharacter = function() {

  if (this.state.data.character === undefined || this.state.data.special === undefined) {
    return null;
  }

  console.dir(this.state.data);

  let character = this.state.data.character[0];
  let special = this.state.data.special[0];

  const maxPoints = 28;
  const totalPoints = special.strength + special.perception + special.endurance +
                      special.charisma + special.intelligence + special.agility + special.luck;
  const remainingPoints = maxPoints - totalPoints;

  return (
    <div className="character" name={character.name} id={character.name} >
      <img src="/assets/img/character.png" alt="char face" className="charFace" />
      <h3 className="characterName"> Name: {character.name} </h3>
      <h3 className="characterLevel"> Level: {character.level} </h3>
      <div className="characterSpecial">
        <h4 className="characterSpecial"> Special: </h4>
        <h5>Special - <i>Points Remaining: {remainingPoints}</i></h5>
        <form id="specialForm"
          onChange={this.handleChange}
          name="specialForm"
          action="/updateCharacter"
          method="POST"
          className="specialForm"
        >
          <table className="specialStats">
            <tbody>
              <tr>
                <th>Strength</th>
                <td>
                  <input id="strength" type="number" name="strength" min="1" max="10" value={special.strength} />
                </td>
              </tr>
              <tr>
                <th>Perception</th>
                <td>
                  <input id="perception" type="number" name="perception" min="1" max="10" value={special.perception} />
                </td>
              </tr>
              <tr>
                <th>Endurance</th>
                <td>
                  <input id="endurance" type="number" name="endurance" min="1" max="10" value={special.endurance} />
                </td>
              </tr>
              <tr>
                <th>Charisma</th>
                <td>
                  <input id="charisma" type="number" name="charisma" min="1" max="10" value={special.charisma} />
                </td>
              </tr>
              <tr>
                <th>Intelligence</th>
                <td>
                  <input id="intelligence" type="number" name="intelligence" min="1" max="10" value={special.intelligence} />
                </td>
              </tr>
              <tr>
                <th>Agility</th>
                <td>
                  <input id="agility" type="number" name="agility" min="1" max="10" value={special.agility} />
                </td>
              </tr>
              <tr>
                <th>Luck</th>
                <td>
                  <input id="luck" type="number" name="luck" min="1" max="10" value={special.luck} />
                </td>
              </tr>
            </tbody>
          </table>
          <table className="playerStats">
            <tbody>
              <tr>
                <th>Hit Points</th>
                <th>Action Points</th>
                <th>Carry Weight</th>
              </tr>
              <tr>
                <td>{character.hitPoints}</td>
                <td>{character.actionPoints}</td>
                <td>{character.carryWeight}</td>
              </tr>
            </tbody>
          </table>

          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input type="hidden" name="_id" value={character._id} />
          <input type="hidden" name="remainingPoints" value={remainingPoints} />
          <input type="hidden" name="name" value={character.name} />
        </form>
      </div>
    </div>
  );
};

// renderer for character list
const renderCharacterList = function() {
  if (this.state.data.length === 0) {
    return (
      <div className="characterList">
        <h3 className="emptyCharacter">No Characters yet</h3>
      </div>
    );
  }

  const characterNodes = this.state.data.map(function(character) {
    const maxPoints = 28;
    const totalPoints = character.strength + character.perception + character.endurance +
                        character.charisma + character.intelligence + character.agility + character.luck;
    const remainingPoints = maxPoints - totalPoints;
    return (
      <div key={character._id} className="character" name={character.name} id={character.name} onClick={this.handleClick} >
        <img src="/assets/img/character.png" alt="char face" className="charFace" />
        <button onClick={this.handleDelete} name={character.name} className="deleteButton">X</button>
        <h3 className="characterName"> Name: {character.name} </h3>
        <h3 className="characterLevel"> Level: {character.level} </h3>
        <input type="hidden" id="_id" name="_id" className="_id" value={character._id} />
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

  CharacterClass = React.createClass({
    loadCharacterFromServer: function(param) {
      sendAjax('POST', '/getCharacter', param, function(data) {
        this.setState({ data:data.character });
      }.bind(this));
    },
    getInitialState: function() {
      return { data: [] };
    },
    handleChange: updateCharacter,
    render: renderCharacter,
  });

  characterForm = ReactDOM.render(
    <CharacterFormClass csrf={csrf} />, document.querySelector("#makeCharacter")
  );

  characterListRenderer = ReactDOM.render(
    <CharacterListClass csrf={csrf} />, document.querySelector("#characters")
  );

  characterRenderer = ReactDOM.render(
    <CharacterClass csrf={csrf} />, document.querySelector("#selectedCharacter")
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
