const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: String, required: true },
  country: { type: String, required: true },   // ⭐ NEW
  state: { type: String, required: true },     // ⭐ NEW
  location: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
