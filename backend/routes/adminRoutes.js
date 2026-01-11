const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const AlertResponse = require("../models/AlertResponse");

// View all reports
router.get("/reports", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

// Assign responder
router.put("/assign/:id", async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, {
    assignedResponder: req.body.responderId,
    status: "In Progress"
  });
  res.json({ message: "Responder assigned" });
});

// Close report
router.put("/close/:id", async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, {
    status: "Resolved"
  });
  res.json({ message: "Report closed" });
});

// 🔥 Risk Assessment API
router.get("/risk-assessment", async (req, res) => {

  const areaStats = await Report.aggregate([
    { $group: { _id: "$area", count: { $sum: 1 } } }
  ]);

  const alertStats = await AlertResponse.aggregate([
    { $group: { _id: "$response", count: { $sum: 1 } } }
  ]);

  res.json({
    highRiskAreas: areaStats,
    alertEngagement: alertStats
  });
});

module.exports = router;
