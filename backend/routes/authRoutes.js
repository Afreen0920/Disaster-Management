// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();

// placeholder controllers (we'll implement later)
router.post("/register", (req, res) => res.json({ msg: "register route - not implemented yet" }));
router.post("/login", (req, res) => res.json({ msg: "login route - not implemented yet" }));

module.exports = router;
