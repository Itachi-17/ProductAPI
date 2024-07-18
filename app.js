const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") }); // Use path.join for consistency
const productRoute = require(path.join(__dirname, "routes/productRoutes.js"));
const authRoute = require(path.join(__dirname, "routes/authRoutes.js"));
const connectDB = require("./config/dbConnection");
const authenticateToken = require("./middleware/authenticateToken");
// const authorizeRoles = require("./middleware/authorizeRoles"); // Corrected import path

const port = 1717;

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute); // Authentication routes
app.use("/api/products", authenticateToken, productRoute); // Product routes with authentication

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
