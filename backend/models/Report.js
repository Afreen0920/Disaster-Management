const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    location: String,
    description: String,

    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Resolved"],
      default: "Submitted"
    },

    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    citizenName: String,

    assignedResponder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
    