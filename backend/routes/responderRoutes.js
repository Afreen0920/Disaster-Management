const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// View assigned reports
router.get("/assigned/:responderId", async (req, res) => {
  const reports = await Report.find({
    assignedResponder: req.params.responderId
  });
  res.json(reports);
});

// Mark report completed
router.put("/complete/:id", async (req, res) => {
  await Report.findByIdAndUpdate(req.params.id, {
    status: "Resolved"
  });
  res.json({ message: "Report completed" });
});

module.exports = router;
