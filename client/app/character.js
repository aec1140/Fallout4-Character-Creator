let perkRenderer;
let specialRenderer;
let SpecialFormClass;
let PerkListClass

// Used to handle submit on the special screen
const handleSpecial = (e) => {
  e.preventDefault();

  sendAjax('POST', $("#specialForm").attr("action"), $("specialForm").serialize(), function() {
    perkRenderer.loadPerksFromServer(); // THIS NEEDS TO BE CREATED
  });

  return false;
};

// Used to render SPECIAL Stat Input menu
const renderSpecial = function() {
  return (
    <form id="specialForm"
      onChange={this.handleChange}
      name="specialForm"
      action="/updateCharacter"
      method="POST"
      className="specialForm"
    >
      <table>
        <tr>
          <th>Strength</th>
          <td>
            <input id="strength" type="number" name="strength" min="1" max="10" />
          </td>
        </tr>
        <tr>
          <th>Perception</th>
          <td>
            <input id="perception" type="number" name="perception" min="1" max="10" />
          </td>
        </tr>
        <tr>
          <th>Endurance</th>
          <td>
            <input id="endurance" type="number" name="endurance" min="1" max="10" />
          </td>
        </tr>
        <tr>
          <th>Charisma</th>
          <td>
            <input id="charisma" type="number" name="charisma" min="1" max="10" />
          </td>
        </tr>
        <tr>
          <th>Intelligence</th>
          <td>
            <input id="intelligence" type="number" name="intelligence" min="1" max="10" />
          </td>
        </tr>
        <tr>
          <th>Agility</th>
          <td>
            <input id="agility" type="number" name="agility" min="1" max="10" />
          </td>
        </tr>
        <tr>
          <th>Luck</th>
          <td>
            <input id="luck" type="number" name="luck" min="1" max="10" />
          </td>
        </tr>
      </table>
      <input type="hidden" name="_csrf" value={this.props.csrf} />
    </form>
  );
}

// Setup function
const setup = function(csrf) {
  SpecialFormClass = React.createClass({
    handleChange: handleSpecial,
    render: renderSpecial,
  });

  specialForm = ReactDOM.render(
    <SpecialFormClass csrf={csrf} />, document.querySelector("#special")
  );
}

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
