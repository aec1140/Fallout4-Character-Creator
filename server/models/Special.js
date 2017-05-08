const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let SpecialModel = {};

const convertId = mongoose.Types.ObjectId;

const SpecialSchema = new mongoose.Schema({
  character: {
    type: mongoose.Schema.ObjectId,
    ref: 'Character',
  },

  strength: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },

  perception: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },

  endurance: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },

  charisma: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },

  intelligence: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },

  agility: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },

  luck: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },
});

// finds a character on the db
SpecialSchema.statics.findById = (specialId, callback) => {
  const id = {
    _id: specialId,
  };

  return SpecialModel.find(id).exec(callback);
};

// removes a character off the db
SpecialSchema.statics.deleteById = (charId, callback) => {
  const id = {
    _id: charId,
  };

  SpecialModel.findByCharacter(charId, (err, doc) => {
    if (err) {
      return callback(err);
    }
    id._id = convertId(doc[0]._doc._id);
    return SpecialModel.remove(id).exec(callback);
  });
};

SpecialSchema.statics.findByCharacter = (charId, callback) => {
  const search = {
    character: convertId(charId),
  };

  return SpecialModel.find(search).exec(callback);
};

// updates a character by id and sets its stats
SpecialSchema.statics.updateById = (charId, stat, callback) => {

  const id = {
    _id: charId,
  };

  const set = {
    $set: stat,
  };

  SpecialModel.findByCharacter(charId, (err, doc) => {
    if (err) {
      return callback(err);
    }
    id._id = convertId(doc[0]._doc._id);
    return SpecialModel.update(id, set).exec(callback);
  });
};

SpecialSchema.statics.toAPI = (doc) => ({
  strength: doc.strength,
  perception: doc.perception,
  endurance: doc.endurance,
  charisma: doc.charisma,
  intelligence: doc.intelligence,
  agility: doc.agility,
  luck: doc.luck,
});

SpecialModel = mongoose.model('Special', SpecialSchema);

module.exports.SpecialModel = SpecialModel;
module.exports.SpecialSchema = SpecialSchema;
