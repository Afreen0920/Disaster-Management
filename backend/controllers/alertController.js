const Alert = require("../models/Alert");

// ADMIN – Broadcast Alert
exports.broadcastAlert = async (req, res) => {
  try {
    const alert = await Alert.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      createdBy: req.user.id
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ALL USERS – Get Active Alerts
exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "Active" }).sort({
      createdAt: -1
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
