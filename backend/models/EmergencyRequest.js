const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  type: String,
  location: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EmergencyRequest", emergencySchema);
