const express = require("express");
const router = express.Router();
const Emergency = require("../models/EmergencyRequest");
const { protect } = require("../middleware/authMiddleware");

// Citizen sends help request
router.post("/", protect, async (req, res) => {
  if (req.user.role !== "citizen") {
    return res.status(403).json({
      message: "Only citizens can request help"
    });
  }

  const request = await Emergency.create({
    citizenId: req.user.id,
    ...req.body
  });

  res.json(request);
});

// Admin & Responder view help requests
router.get("/", protect, async (req, res) => {
  if (!["admin", "responder"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const requests = await Emergency.find().populate(
    "citizenId",
    "name email"
  );
  res.json(requests);
});

module.exports = router;
