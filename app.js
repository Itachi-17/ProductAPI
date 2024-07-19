const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const productRoute = require(path.join(__dirname, "routes/productRoutes.js"));
const authRoute = require(path.join(__dirname, "routes/authRoutes.js"));
const connectDB = require("./config/dbConnection");
const authenticateToken = require("./middleware/authenticateToken");
const errorHandler = require("./middleware/errorHandlers");

const port = process.env.PORT || 1717;

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoute);
app.use("/api/products", authenticateToken, productRoute);

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
