const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let PerkModel = {};

const convertId = mongoose.Types.ObjectId;

const PerkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rank: {
    type: Number,
    min: 1,
    required: true,
  },
  attributeName: {
    type: String,
    required: true,
    trim: true,
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

PerkSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  rank: doc.rank,
  attributeName: doc.attributeName,
  attributeRank: doc.attributeRank,
  requiredLevel: doc.requiredLevel,
  description: doc.description,
});

PerkModel = mongoose.model('Perk', PerkSchema);

module.exports.PerkModel = PerkModel;
module.exports.PerkSchema = PerkSchema;
