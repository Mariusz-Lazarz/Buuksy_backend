const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many request try again in 1 hour",
});

// // Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(xss());
app.use(limiter);

// Routes
const authRoutes = require("./routes/auth");
const salonRoutes = require("./routes/salons");
const visitsRoutes = require("./routes/visits");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/salons", salonRoutes);
app.use("/api/v1/visits", visitsRoutes);

app.use((err, req, res, next) => {
  res.status(500).send("Server error");
});

module.exports = app;
