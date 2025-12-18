const Acknowledgement = require("../models/Acknowledgement");

exports.acknowledgeAlert = async (req, res) => {
  try {
    if (req.user.role !== "responder") {
      return res.status(403).json({
        message: "Only responders can acknowledge alerts"
      });
    }

    const already = await Acknowledgement.findOne({
      alertId: req.params.alertId,
      responderId: req.user.id
    });

    if (already) {
      return res.status(400).json({
        message: "Alert already acknowledged"
      });
    }

    const ack = await Acknowledgement.create({
      alertId: req.params.alertId,
      responderId: req.user.id
    });

    res.status(201).json({
      message: "Alert acknowledged successfully",
      acknowledgement: ack
    });
  } catch (err) {
    res.status(500).json({
      message: "Acknowledgement failed"
    });
  }
};
