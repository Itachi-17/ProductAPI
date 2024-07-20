const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require(path.join(__dirname, "dbConnection.js"));
const productRoute = require("./routes/productRoutes.js");
const authRoute = require("./routes/authRoutes.js");
const authenticateToken = require("./middleware/authenticateToken.js");
const errorHandler = require("./middleware/errorHandlers.js");
const cors = require("cors");

console.log("Starting application...");

// Load environment variables
// dotenv.config({ path: path.join(__dirname, ".env") });
// console.log("Environment variables loaded");

const app = express();

// Connect to the database
connectDB().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  console.log("Received request to root path");
  res.send("API is running...");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/auth", authRoute);
app.use("/api/products", authenticateToken, productRoute);

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// Global error handler
app.use(errorHandler);

const port = process.env.PORT || 1717;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Unhandled promise rejection handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});
