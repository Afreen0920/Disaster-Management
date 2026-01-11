const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");

// View assigned reports (NO responderId)
router.get("/assigned", auth, async (req, res) => {
  if (req.user.role !== "responder") {
    return res.status(403).json({ message: "Responder only" });
  }

  const reports = await Report.find({
    status: "Assigned"
  });

  res.json(reports);
});

// Mark report completed
router.put("/complete/:id", auth, async (req, res) => {
  if (req.user.role !== "responder") {
    return res.status(403).json({ message: "Responder only" });
  }

  await Report.findByIdAndUpdate(req.params.id, {
    status: "Completed"
  });

  res.json({ message: "Report completed" });
});

module.exports = router;
