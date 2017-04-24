const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let PerksModel = {};

const Attribute = {
  STR: 0,
  PER: 1,
  END: 2,
  CHA: 3,
  INT: 4,
  AGI: 5,
  LCK: 6,
};

const convertId = mongoose.Types.ObjectId;

const PerkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rank: {
    type: Number,
    min: 0,
    required: true,
  },
  attributeName: {
    type: Attribute,
    required: true,
  },
  attributeRank: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  requiredLevel: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const PerksSchema = new mongoose.Schema({
  perks: [PerkSchema],

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PerksSchema.statics.toAPI = (doc) => ({
  perks: doc.perks,
});

PerksModel = mongoose.model('Perks', PerksSchema);

module.exports.PerksModel = PerksModel;
module.exports.PerksSchema = PerksSchema;
