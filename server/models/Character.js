const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let CharacterModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  level: {
    type: Number,
    min: 1,
    default: 1,
  },

  // SPECIAL STATS
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

  // Char Stats
  hitPoints: {
    type: Number,
    default: 85,
  },

  actionPoints: {
    type: Number,
    default: 70,
  },

  carryWeight: {
    type: Number,
    default: 210,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

CharacterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

CharacterSchema.statics.deleteById = (charId, callback) => {
  const id = {
    _id : charId,
  };

  return CharacterModel.remove(id).exec(callback);
};

CharacterSchema.statics.findById = (charId, callback) => {
  const id = {
    _id : charId,
  };

  return CharacterModel.find(id).exec(callback);
};

CharacterSchema.statics.updateById = (charId, stat, callback) => {
  const id = {
    _id : charId,
  };

  const set = {
    $set: stat,
  };

  return CharacterModel.update(id, set).exec(callback);
};

CharacterSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CharacterModel.find(search).exec(callback);
};

CharacterSchema.statics.findByName = (name, callback) => {
  const search = {
    name: name,
  };

  return CharacterModel.find(search).select('name carryWeight').exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;
