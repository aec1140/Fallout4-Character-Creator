const models = require('../models');
const stat = require('./perks.json');

const Character = models.Character;
const Special = models.Special;
const Perk = models.Perk;


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

  // New Character Perks
  const value = stat.perks;
  const perks = [];

  for (let i = 1; i <= 229; ++i) {
    const perkData = value[i];

    if (perkData.characterLevel === 0) {
      const perk = new Perk.PerkModel({
        name: perkData.name,
        rank: perkData.rank,
        attributeName: perkData.attribute,
        attributeRank: perkData.attributeLevel,
        requiredLevel: perkData.characterLevel,
        description: perkData.description,
      });
      perks.push(perk);
    }
  }

  return newCharacter.save((err1) => {
    if (err1) {
      console.log(err1);
      return res.status(400).json({ error: 'Had an error saving character' });
    }

    const specialStats = new Special.SpecialModel({
      character: newCharacter._id,
      nextPerks: perks,
    });

    return specialStats.save((err2) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'Had an error saving special' });
      }

      return res.json({ redirect: '/characters' });
    });
  });
};

// returns a character by Id
const getCharacter = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findById(req.body._id, (err1, char) => {
    if (err1) {
      console.log(err1);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return Special.SpecialModel.findByCharacter(req.body._id, (err2, special) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }
      const data = {
        character: char,
        special,
      };

      return res.json({ character: data });
    });
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

  return Character.CharacterModel.deleteById(req.body._id, (err1, char) => {
    if (err1) {
      console.log(err1);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return Special.SpecialModel.deleteById(req.body._id, (err2, special) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }

      const data = {
        character: char,
        special,
      };

      return res.json({ characters: data });
    });
  });
};

// updates a character based off Id
// will not update if they have no more points to allocate
const updateCharacter = (request, response) => {
  const req = request;
  const res = response;

  const charData = {
    hitPoints: 80 + req.body.endurance * 5,
    actionPoints: 60 + req.body.agility * 10,
    carryWeight: 200 + req.body.strength * 10,
  };

  const specialData = {
    strength: req.body.strength,
    perception: req.body.perception,
    endurance: req.body.endurance,
    charisma: req.body.charisma,
    intelligence: req.body.intelligence,
    agility: req.body.agility,
    luck: req.body.luck,
  };

  let pointCount = parseInt(specialData.strength, 10) + parseInt(specialData.perception, 10);
  pointCount += parseInt(specialData.endurance, 10) + parseInt(specialData.charisma, 10);
  pointCount += parseInt(specialData.intelligence, 10) + parseInt(specialData.agility, 10);
  pointCount += parseInt(specialData.luck, 10);

  if (pointCount > 28) {
    return res.status(400).json({ error: 'You are out of points' });
  }

  return Character.CharacterModel.updateById(req.body._id, charData, (err1, char) => {
    if (err1) {
      console.log(err1);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return Special.SpecialModel.updateById(req.body._id, specialData, (err2, special) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }

      const data = {
        character: char,
        special,
      };

      return res.json({ characters: data });
    });
  });
};

module.exports.charactersPage = charactersPage;
module.exports.create = createCharacter;
module.exports.getCharacters = getCharacters;
module.exports.getCharacter = getCharacter;
module.exports.deleteCharacter = deleteCharacter;
module.exports.updateCharacter = updateCharacter;
