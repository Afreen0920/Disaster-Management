const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const AlertResponse = require("../models/AlertResponse");

// Citizen submits report
router.post("/report", async (req, res) => {
  const report = await Report.create(req.body);
  res.json(report);
});

// Citizen responds to alert
router.post("/alert-response", async (req, res) => {
  await AlertResponse.create(req.body);
  res.json({ message: "Alert response recorded" });
});

module.exports = router;
