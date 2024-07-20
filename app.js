const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require(path.join(__dirname, "dbConnection.js"));
const productRoute = require("./routes/productRoutes.js");
const authRoute = require("./routes/authRoutes.js");
const authenticateToken = require("./middleware/authenticateToken.js");
const errorHandler = require("./middleware/errorHandlers.js");

console.log("Starting application...");

const app = express();

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("Environment variables loaded");

// Connect to the database
connectDB().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  console.log("Received request to root path");
  res.send("API is running...");
});

app.use("/api/auth", authRoute);
app.use("/api/products", authenticateToken, productRoute);

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
