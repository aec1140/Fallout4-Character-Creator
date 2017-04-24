const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let SpecialModel = {};

const convertId = mongoose.Types.ObjectId;

const SpecialSchema = new mongoose.Schema({
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
