const models = require('../models');

const Character = models.Character;

// character page creator
const charactersPage = (req, res) => {
  Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), character: docs });
  });
};

// creates a character and stores it on the DB
const createCharacter = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Please enter a name!' });
  }
  const characterData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  const newCharacter = new Character.CharacterModel(characterData);

  const characterPromise = newCharacter.save();

  characterPromise.then(() => res.json({ redirect: '/characters' }));

  characterPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error has occured.' });
  });

  return characterPromise;
};

// returns a character by Id
const getCharacter = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findById(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ character: docs });
  });
};

// returns all characters attached to the owner
const getCharacters = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ characters: docs });
  });
};

// deletes a character off the server by Id
const deleteCharacter = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.deleteById(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ characters: docs });
  });
};

// updates a character based off Id
// will not update if they have no more points to allocate
const updateCharacter = (request, response) => {
  const req = request;
  const res = response;

  const data = {
    strength: req.body.strength,
    perception: req.body.perception,
    endurance: req.body.endurance,
    charisma: req.body.charisma,
    intelligence: req.body.intelligence,
    agility: req.body.agility,
    luck: req.body.luck,
    hitPoints: 80 + req.body.endurance * 5,
    actionPoints: 60 + req.body.agility * 10,
    carryWeight: 200 + req.body.strength * 10,
  };

  let pointCount = parseInt(data.strength, 10) + parseInt(data.perception, 10);
  pointCount += parseInt(data.endurance, 10) + parseInt(data.charisma, 10);
  pointCount += parseInt(data.intelligence, 10) + parseInt(data.agility, 10);
  pointCount += parseInt(data.luck, 10);

  if (pointCount > 28) {
    return res.status(400).json({ error: 'You are out of points' });
  }

  return Character.CharacterModel.updateById(req.body._id, data, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ characters: docs });
  });
};

module.exports.charactersPage = charactersPage;
module.exports.create = createCharacter;
module.exports.getCharacters = getCharacters;
module.exports.getCharacter = getCharacter;
module.exports.deleteCharacter = deleteCharacter;
module.exports.updateCharacter = updateCharacter;
