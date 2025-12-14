const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get logged in user
router.get("/me", auth, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put("/me", auth, async (req, res) => {
  const updates = req.body;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true
  }).select("-password");

  res.json(user);
});

// Change password
router.put("/me/password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!(await user.matchPassword(oldPassword))) {
    return res.status(400).json({ message: "Incorrect old password" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed" });
});

module.exports = router;
