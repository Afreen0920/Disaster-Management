const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { protect } = require("../middleware/authMiddleware");

/* ADMIN: BROADCAST ALERT */
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
      latitude: req.body.latitude ?? null,
      longitude: req.body.longitude ?? null,
      createdBy: req.user.id,
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

/* GET ACTIVE ALERTS */
router.get("/active", protect, async (req, res) => {
  const alerts = await Alert.find({ status: "Active" }).sort({ createdAt: -1 });
  res.json(alerts);
});

module.exports = router;
