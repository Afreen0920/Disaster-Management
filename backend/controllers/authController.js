const User = require("../models/User");
const jwt = require("jsonwebtoken");

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    console.log("Register request:", req.body);

    const { name, email, password, address, phone, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    // ❗ Do NOT hash — mongoose will do it automatically
    const user = await User.create({
      name,
      email,
      password,
      address,
      phone,
      role,
    });

    return res.status(200).json({
      success: true,
      user: { ...user.toObject(), password: undefined },
    });

  } catch (err) {
    console.log("Register error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
