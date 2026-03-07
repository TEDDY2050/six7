const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  exposedHeaders: ['Content-Disposition'],
}));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("🎮 Game Arena API is Running...");
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/games", require("./routes/games"));
app.use("/api/stations", require("./routes/stations"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/reports", require("./routes/reports"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
