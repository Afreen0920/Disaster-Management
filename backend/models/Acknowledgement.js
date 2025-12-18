const express = require("express");
const router = express.Router();
const Acknowledgement = require("../models/Acknowledgement");
const { protect } = require("../middleware/authMiddleware");

/* =====================================================
   POST – RESPONDER ACKNOWLEDGES ALERT
   ===================================================== */
router.post("/:alertId", protect, async (req, res) => {
  try {
    // 🔒 Role-based access (Regulatory control)
    if (req.user.role !== "responder") {
      return res.status(403).json({
        message: "Only responders can acknowledge alerts"
      });
    }

    // ❌ Prevent duplicate acknowledgement
    const already = await Acknowledgement.findOne({
      alertId: req.params.alertId,
      responderId: req.user.id
    });

    if (already) {
      return res.status(400).json({
        message: "Alert already acknowledged"
      });
    }

    // ✅ Save acknowledgement
    const ack = await Acknowledgement.create({
      alertId: req.params.alertId,
      responderId: req.user.id
    });

    res.status(201).json({
      message: "Alert acknowledged successfully",
      acknowledgement: ack
    });
  } catch (err) {
    console.error("Acknowledgement Error:", err);
    res.status(500).json({
      message: "Acknowledgement failed"
    });
  }
});

/* =====================================================
   GET – WHO ACKNOWLEDGED THIS ALERT (REPORTING)
   ===================================================== */
router.get("/:alertId", protect, async (req, res) => {
  try {
    const data = await Acknowledgement.find({
      alertId: req.params.alertId
    }).populate("responderId", "name role");

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch acknowledgements"
    });
  }
});

module.exports = router;

