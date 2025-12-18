require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

/* ==============================
   DATABASE CONNECTION
   ============================== */
connectDB();

/* ==============================
   MIDDLEWARES
   ============================== */
app.use(cors());                // Allow frontend-backend communication
app.use(express.json());        // Parse JSON request body
app.use(morgan("dev"));         // Log API requests

/* ==============================
   ROUTES
   ============================== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/emergency", require("./routes/emergencyRoutes"));


/*
 FUTURE (optional – for citizen emergency requests)
 app.use("/api/requests", require("./routes/requestRoutes"));
*/

/* ==============================
   DEFAULT ROUTE
   ============================== */
app.get("/", (req, res) => {
  res.send("Disaster Management API is running");
});

/* ==============================
   SERVER START
   ============================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
