const mongoose = require("mongoose");

const rescueSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "Completed"],
      default: "Pending"
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rescue", rescueSchema);
