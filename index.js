const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const hpp = require("hpp");
dotenv.config();
const errorHandler = require("./BACKEND/src/middleware/errorHandler");
const { generalLimiter } = require("./BACKEND/src/middleware/rateLimiter");

const auth = require("./BACKEND/src/routes/auth");
const user = require("./BACKEND/src/routes/user");
const wallet = require("./BACKEND/src/routes/wallets");
const electricity = require("./BACKEND/src/routes/electricity");
const airtime = require("./BACKEND/src/routes/airtime");
const data = require("./BACKEND/src/routes/data");

const app = express();

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/Profile.html")); // or whatever your profile HTML file is named
});

app.get("/fund", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/fund.html"));
});

app.get("/history", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/History.html"));
});

app.get("/airtime", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/airtime.html"));
});

app.get("/data", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/data.html"));
});

app.get("/wallet", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/wallet.html"));
});

app.get("/onboardingpage1", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/onboardingpage1.html"));
});

app.get("/onboardingpage2", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/onboardingpage2.html"));
});

app.get("/onboardingpage3", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/onboardingpage3.html"));
});

app.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/payment-method.html"));
});

app.get("/card-payment", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "html/card-payment.html"));
});

app.get('/forgetpass', (req, res) => {
    res.sendFile(path.join(__dirname, 'FRONTEND', 'forgetpass.html'));
})
// index.js

console.log("Mongo_URI:", process.env.MONGO_URI); // add this before mongoose.connect

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(express.static("FRONTEND"));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security headers
app.use(helmet());

// Prevent NoSQL injections

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});


// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Rate limiting
app.use(generalLimiter);

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Mount routers
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/wallet", wallet);
app.use("/api/bills/electricity", electricity);
app.use("/api/bills/airtime", airtime);
app.use("/api/bills/data", data);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

module.exports = app;

app.get("/", (req, res) => {
  res.send("instant app");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
