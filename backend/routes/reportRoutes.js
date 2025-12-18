const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const Acknowledgement = require("../models/Acknowledgement");
const { protect } = require("../middleware/authMiddleware");

router.get("/summary", protect, async (req, res) => {
  const totalAlerts = await Alert.countDocuments();
  const activeAlerts = await Alert.countDocuments({ status: "Active" });
  const resolvedAlerts = await Alert.countDocuments({ status: "Resolved" });
  const acknowledgements = await Acknowledgement.countDocuments();

  res.json({
    totalAlerts,
    activeAlerts,
    resolvedAlerts,
    acknowledgements
  });
});

module.exports = router;
