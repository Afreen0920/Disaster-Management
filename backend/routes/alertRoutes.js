// backend/routes/alertRoutes.js
const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// -----------------------------
// DUMMY ALERTS (5 TOTAL)
// -----------------------------
const dummyAlerts = [
  // ===== INDIA (3 Alerts) =====
  {
    title: "Heavy Rainfall Alert",
    type: "Flood",
    severity: "Moderate",
    country: "India",
    state: "Maharashtra",
    location: "Mumbai, Maharashtra",
    lat: 19.0760,
    lng: 72.8777
  },
  {
    title: "Cyclone Landfall Expected",
    type: "Weather",
    severity: "High",
    country: "India",
    state: "Odisha",
    location: "Puri, Odisha",
    lat: 19.8135,
    lng: 85.8312
  },
  {
    title: "Earthquake Tremors",
    type: "Earthquake",
    severity: "Low",
    country: "India",
    state: "Gujarat",
    location: "Bhuj, Gujarat",
    lat: 23.2419,
    lng: 69.6669
  },

  // ===== OTHER COUNTRIES (2 Alerts) =====
  {
    title: "Severe Tornado Warning",
    type: "Weather",
    severity: "High",
    country: "USA",
    state: "Texas",
    location: "Dallas, Texas",
    lat: 32.7767,
    lng: -96.7970
  },
  {
    title: "Typhoon Alert",
    type: "Weather",
    severity: "Moderate",
    country: "Japan",
    state: "Okinawa",
    location: "Naha, Okinawa",
    lat: 26.2124,
    lng: 127.6809
  }
];

// -----------------------------
// SEED ALERTS (ADD 5 ALERTS)
// -----------------------------
router.get("/seed", async (req, res) => {
  try {
    await Alert.deleteMany();
    const added = await Alert.insertMany(dummyAlerts);

    res.json({
      message: "Dummy alerts added successfully",
      count: added.length,
      alerts: added
    });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: "Failed to seed alerts" });
  }
});

// -----------------------------
// GET ALL ALERTS
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Failed to load alerts" });
  }
});

// -----------------------------
// CREATE NEW ALERT
// -----------------------------
router.post("/", async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (err) {
    console.error("Create Alert Error:", err);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

module.exports = router;
