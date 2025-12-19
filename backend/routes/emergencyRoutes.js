const express = require("express");
const router = express.Router();
const Emergency = require("../models/EmergencyRequest");
const { protect } = require("../middleware/authMiddleware");

/* =============================
   CITIZEN → REQUEST HELP
   ============================= */
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({ message: "Only citizens can request help" });
    }

    const request = await Emergency.create({
      ...req.body,
      citizenId: req.user.id
    });

    res.status(201).json(request);
  } catch {
    res.status(500).json({ message: "Failed to send help request" });
  }
});

/* =============================
   ADMIN / RESPONDER → VIEW REQUESTS
   ============================= */
router.get("/", protect, async (req, res) => {
  if (req.user.role === "citizen") {
    return res.status(403).json({ message: "Access denied" });
  }

  const requests = await Emergency.find({ status: "Pending" })
    .populate("citizenId", "name");

  res.json(requests);
});

/* =============================
   RESPONDER → MARK COMPLETED
   ============================= */
router.put("/:id/complete", protect, async (req, res) => {
  if (req.user.role !== "responder") {
    return res.status(403).json({ message: "Only responders can complete" });
  }

  await Emergency.findByIdAndUpdate(req.params.id, {
    status: "Completed"
  });

  res.json({ message: "Request completed" });
});

module.exports = router;
