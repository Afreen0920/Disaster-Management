const express = require("express");
const router = express.Router();
const Rescue = require("../models/Rescue");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

/* ================= CITIZEN: CREATE ================= */
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({ message: "Citizen only" });
    }

    const { location, message } = req.body;
    if (!location || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const rescue = await Rescue.create({
      location,
      message,
      citizen: req.user._id,
      status: "Pending"
    });

    res.status(201).json(rescue);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Create failed" });
  }
});

/* ================= VIEW (TEMP FIX) ================= */
router.get("/", protect, async (req, res) => {
  try {
    let filter;

    // ADMIN → see pending
    if (req.user.role === "admin") {
      filter = { status: "Pending" };
    }

    // RESPONDER → see ALL assigned rescues
    else if (req.user.role === "responder") {
      filter = { status: "Assigned" };
    }

    // CITIZEN → see own rescues
    else if (req.user.role === "citizen") {
      filter = { citizen: req.user._id };
    }

    const rescues = await Rescue.find(filter)
      .populate("citizen", "name phone")
      .populate("responder", "name");

    res.json(rescues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ================= ADMIN: ASSIGN ================= */
router.put("/:id/assign", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const rescue = await Rescue.findById(req.params.id);
    if (!rescue) {
      return res.status(404).json({ message: "Not found" });
    }

    if (rescue.status !== "Pending") {
      return res.status(400).json({ message: "Already assigned" });
    }

    const responder = await User.findOne({ role: "responder" });
    if (!responder) {
      return res.status(404).json({ message: "No responder available" });
    }

    rescue.responder = responder._id;
    rescue.status = "Assigned";
    await rescue.save();

    res.status(200).json(rescue);
  } catch (err) {
    console.error("ASSIGN ERROR:", err);
    res.status(500).json({ message: "Assign failed" });
  }
});

/* ================= RESPONDER: COMPLETE & CLOSE ================= */
router.put("/:id/complete", protect, async (req, res) => {
  try {
    // ✅ role check only
    if (req.user.role !== "responder") {
      return res.status(403).json({ message: "Responder only" });
    }

    const rescue = await Rescue.findById(req.params.id);

    if (!rescue) {
      return res.status(404).json({ message: "Rescue not found" });
    }

    // 🔥 CLOSE = DELETE
    await Rescue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Successfully completed the rescue operation"
    });
  } catch (err) {
    console.error("COMPLETE ERROR:", err);
    res.status(500).json({ message: "Server error while completing rescue" });
  }
});


module.exports = router;
