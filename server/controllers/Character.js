const models = require('../models');

const Character = models.Character;

const characterPage = (req, res) => {
  Character.CharacterModel.findByName(req.params.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log(docs);
    return res.render('character', { csrfToken: req.csrfToken(), character: docs });
  });
};

const getCharacter = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findByName(req.params.name, (err, docs) => {
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

  return Character.CharacterModel.updateById(req.body.id, {level: 10}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ characters: docs });
  });
};

module.exports.characterPage = characterPage;
module.exports.getCharacter = getCharacter;
module.exports.updateCharacter = updateCharacter;
