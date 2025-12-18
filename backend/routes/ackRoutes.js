const express = require("express");
const router = express.Router();
const { acknowledgeAlert } = require("../controllers/ackController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:alertId", protect, acknowledgeAlert);

module.exports = router;
