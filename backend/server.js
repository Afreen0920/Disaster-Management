require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

/* ===== IMPORT ROUTES (MATCH YOUR FILE NAMES EXACTLY) ===== */
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reports");          // ✅ reports.js
const alertRoutes = require("./routes/alertRoutes");       // ✅ alertRoutes.js
const rescueRoutes = require("./routes/rescueRoutes");     // ✅ rescueRoutes.js
const responderRoutes = require("./routes/responderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const ackRoutes = require("./routes/ackRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* ===== CONNECT DB ===== */
connectDB();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/reports", reportRoutes);     // 🔥 MAIN REPORT ROUTE
app.use("/api/alerts", alertRoutes);
app.use("/api/rescue", rescueRoutes);

app.use("/api/responder", responderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/ack", ackRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.send("🚀 Disaster Management API running");
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
