let characterRenderer; // Character Renderer Component
let characterForm; // Character Add Form Render Component
let CharacterFormClass; // Character Form React UI Class
let CharacterListClass; // Character List React UI Class

const handleCharacter = (e) => {
  e.preventDefault();

  $("#characterMessage").animate({width:'hide'},350);
  if ($("#characterName").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
  }
  sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function() {
    characterRenderer.loadCharactersFromServer();
  });

  return false;
};

const deleteCharacter = function(e) {
  if (!confirm(`Do you want to delete ${e.target.name}?`)) return;

  sendAjax('POST', '/deleteCharacter', $("#specialForm").serialize(), function() {
    characterRenderer.loadCharactersFromServer();
  });
};

const updateCharacter = function(e) {
  sendAjax('POST', '/updateCharacter', $("#specialForm").serialize(), function() {
    characterRenderer.loadCharactersFromServer();
  });
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
    const maxPoints = 28;
    const totalPoints = character.strength + character.perception + character.endurance +
                        character.charisma + character.intelligence + character.agility + character.luck;
    const remainingPoints = maxPoints - totalPoints;
    return (
      <div key={character._id} className="character" name={character.name} id={character.name} >
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <button onClick={this.handleDelete} name={character.name} className="deleteButton">X</button>
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
                    <input id="strength" type="number" name="strength" min="1" max="10" value={character.strength} />
                  </td>
                </tr>
                <tr>
                  <th>Perception</th>
                  <td>
                    <input id="perception" type="number" name="perception" min="1" max="10" value={character.perception} />
                  </td>
                </tr>
                <tr>
                  <th>Endurance</th>
                  <td>
                    <input id="endurance" type="number" name="endurance" min="1" max="10" value={character.endurance} />
                  </td>
                </tr>
                <tr>
                  <th>Charisma</th>
                  <td>
                    <input id="charisma" type="number" name="charisma" min="1" max="10" value={character.charisma} />
                  </td>
                </tr>
                <tr>
                  <th>Intelligence</th>
                  <td>
                    <input id="intelligence" type="number" name="intelligence" min="1" max="10" value={character.intelligence} />
                  </td>
                </tr>
                <tr>
                  <th>Agility</th>
                  <td>
                    <input id="agility" type="number" name="agility" min="1" max="10" value={character.agility} />
                  </td>
                </tr>
                <tr>
                  <th>Luck</th>
                  <td>
                    <input id="luck" type="number" name="luck" min="1" max="10" value={character.luck} />
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
    handleChange: updateCharacter,
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
