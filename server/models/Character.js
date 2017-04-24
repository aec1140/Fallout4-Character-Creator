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
    unique: true,
    set: setName,
  },

  sex: {
    type: String,
    required: true,
    trim: true,
  },

  level: {
    type: Number,
    min: 1,
    default: 1,
  },

  special: {
    type: mongoose.Schema.ObjectId,
    ref: 'Special',
  },

  perk: {
    type: mongoose.Schema.ObjectId,
    ref: 'Perk',
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
  sex: doc.sex,
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

  return CharacterModel.find(search).select('name sex level').exec(callback);
};

CharacterSchema.statics.findByName = (name, callback) => {
  const search = {
    name: name,
  };

  return CharacterModel.find(search).select('name sex level').exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;
