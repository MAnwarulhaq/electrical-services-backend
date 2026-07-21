require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

// =======================
// Route Imports
// =======================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceAreaRoutes = require("./routes/serviceAreaRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const electricianRoutes = require("./routes/electricianRoutes");
const contactRoutes = require("./routes/contactRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// =======================
// Connect Database
// =======================

connectDB();

const app = express();

// =======================
// CORS
// =======================

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://electrofix-nine.vercel.app",
  "https://electrofix.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS Not Allowed"));
    },
    credentials: true,
  })
);

// =======================
// Body Parser
// =======================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Logger
// =======================

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// =======================
// Static Files
// =======================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =======================
// Health Check
// =======================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Electrical Services API is running 🚀",
  });
});

// =======================
// API Routes
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/areas", serviceAreaRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/electricians", electricianRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

// =======================
// Home Route
// =======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ElectroFix Backend Running Successfully 🚀",
  });
});

// =======================
// 404 Handler
// =======================

app.use(notFound);

// =======================
// Error Handler
// =======================

app.use(errorHandler);

// =======================
// Start Server
// =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});