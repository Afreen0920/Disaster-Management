const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const User = require("../models/User");
const auth = require("../middleware/auth");

/* ================= CITIZEN ================= */

// Submit report
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "citizen") {
    return res.status(403).json({ message: "Citizen only" });
  }

  const report = await Report.create({
    title: req.body.title,
    category: req.body.category,
    location: req.body.location,
    description: req.body.description,
    status: "Submitted",
    citizenId: req.user._id,
    citizenName: req.user.name
  });

  res.json(report);
});

// View own reports
router.get("/my", auth, async (req, res) => {
  const reports = await Report.find({ citizenId: req.user._id });
  res.json(reports);
});

/* ================= ADMIN ================= */

// Get ALL reports
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const reports = await Report.find();
  res.json(reports);
});

// Assign responder (AUTO ASSIGN – NO RESPONDER ID LOGIC)
router.put("/assign/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  // Auto assign (no responder-specific logic)
  await Report.findByIdAndUpdate(req.params.id, {
    status: "Assigned"
  });

  res.json({
    message: "Report assigned"
  });
});

// Risk analytics
router.get("/risk", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const areas = await Report.aggregate([
    { $group: { _id: "$location", count: { $sum: 1 } } }
  ]);

  const acknowledged = await Report.countDocuments({ status: "Completed" });
  const ignored = await Report.countDocuments({ status: "Submitted" });

  res.json({
    areas,
    engagement: { acknowledged, ignored }
  });
});

/* ================= RESPONDER ================= */

// 🔥 NUCLEAR FIX: responder sees ALL assigned reports
router.get("/assigned", auth, async (req, res) => {
  if (req.user.role !== "responder") {
    return res.status(403).json({ message: "Responder only" });
  }

  const reports = await Report.find({
    status: "Assigned"
  });

  res.json(reports);
});

// Mark report as completed
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
