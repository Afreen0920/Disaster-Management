const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EmergencyRequest", emergencySchema);
