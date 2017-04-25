const models = require('../models');

const Character = models.Character;

const charactersPage = (req, res) => {
  Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), character: docs });
  });
};

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

const updateCharacter = (request, response) => {
  const req = request;
  const res = response;

  if (req.body.remainingPoints == 0) {
    return res.status(400).json({ error: 'You are out of points' });
  }

  const data = {
    strength: req.body.strength,
    perception: req.body.perception,
    endurance: req.body.endurance,
    charisma: req.body.charisma,
    intelligence: req.body.intelligence,
    agility: req.body.agility,
    luck: req.body.luck,
    hitPoints: 80 + req.body.endurance*5,
    actionPoints: 60 + req.body.agility*10,
    carryWeight: 200 + req.body.strength*10,
  };

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
module.exports.deleteCharacter = deleteCharacter;
module.exports.updateCharacter = updateCharacter;
