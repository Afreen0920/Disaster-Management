// backend/models/Alert.js
const mongoose = require("mongoose");
const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  severity: { type: String, enum: ["low","medium","high","critical"], default: "low" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

AlertSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Alert", AlertSchema);
