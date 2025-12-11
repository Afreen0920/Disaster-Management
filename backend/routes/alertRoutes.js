// backend/routes/alertRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json([])); // return empty array for now

module.exports = router;
