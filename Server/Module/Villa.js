const mongoose = require('mongoose');

const villaSchema = new mongoose.Schema({
  Villaname: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  location: { type: String, required: true, trim: true },
  place: { type: String, required: true, trim: true },
  Imageview: { type: String, required: true },
  guest: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  bathrooms: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Villa', villaSchema);
