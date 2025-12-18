const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

/* ================= ADMIN: BROADCAST ALERT ================= */
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can broadcast alerts" });
    }

    const alert = await Alert.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      severity: req.body.severity || "Moderate",
      status: "Active",
      createdBy: req.user.id,
    });

    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: "Failed to create alert" });
  }
});

/* ================= GET ACTIVE ALERTS ================= */
router.get("/active", protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "Active" }).sort({
      createdAt: -1,
    });
    res.json(alerts);
  } catch {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

/* ================= ADMIN: RESOLVE ALERT ================= */
router.put("/:id/resolve", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can resolve alerts" });
    }

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );

    res.json(alert);
  } catch {
    res.status(500).json({ error: "Failed to resolve alert" });
  }
});

module.exports = router;
