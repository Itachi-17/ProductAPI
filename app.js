const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: __dirname + "/.env" });
const productRoute = require(path.join(__dirname, "routes/productRoutes.js"));
const connectDB = require("./Config/dbConnection");

// const userRoute = require(path.join(__dirname, "routes/userRoutes.js"));
// const errorHandler = require("./Middleware/errorHandler");
// const connectDB = require("./Config/dbConnection");
const port = 1717;

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/products", productRoute);
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// ProductAPI
//     \config\dbConnection.js
//     \controllers\productController.js
//     \routes\productRoutes.js
//     \node_modules
//     \.env
//     \app.js
//     \package-lock.json
//     \package.json
