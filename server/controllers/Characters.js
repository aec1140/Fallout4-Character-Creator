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
  if (!req.body.name || !req.body.sex) {
    return res.status(400).json({ error: 'RAWR! Name and Sex are required' });
  }
  const characterData = {
    name: req.body.name,
    sex: req.body.sex,
    owner: req.session.account._id,
  };

  const newCharacter = new Character.CharacterModel(characterData);

  const characterPromise = newCharacter.save();

  characterPromise.then(() => res.json({ redirect: '/characters' }));

  characterPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Character name already in use' });
    }

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

  return Character.CharacterModel.deleteById(req.body.id, (err, docs) => {
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
