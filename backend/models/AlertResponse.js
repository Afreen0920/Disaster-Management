const mongoose = require("mongoose");

const alertResponseSchema = new mongoose.Schema({
  citizenId: String,
  response: {
    type: String,
    enum: ["Acknowledged", "Ignored"]
  }
});

module.exports = mongoose.model("AlertResponse", alertResponseSchema);
