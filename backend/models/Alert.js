const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  severity: {
    type: String,
    enum: ["Critical", "High", "Moderate", "Low"],
    default: "Moderate",
  },

  status: {
    type: String,
    enum: ["Active", "Resolved"],
    default: "Active",
  },

  // 🔥 OPTIONAL FOR ADMIN ALERTS
  latitude: {
    type: Number,
    required: false,
  },

  longitude: {
    type: Number,
    required: false,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Alert || mongoose.model("Alert", alertSchema);
