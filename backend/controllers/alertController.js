// backend/controllers/alertController.js
const Alert = require("../models/Alert");

exports.createAlert = async (req, res) => {
  try {
    const { title, description, severity, lng, lat } = req.body;
    if (typeof lng !== "number" || typeof lat !== "number") {
      return res.status(400).json({ msg: "lng and lat must be numbers" });
    }
    const alert = new Alert({
      title,
      description,
      severity,
      location: { type: "Point", coordinates: [lng, lat] },
      createdBy: req.user.id
    });
    await alert.save();
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getAlerts = async (req, res) => {
  try {
    // return newest first
    const alerts = await Alert.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate("createdBy", "name email");
    if (!alert) return res.status(404).json({ msg: "Alert not found" });
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
