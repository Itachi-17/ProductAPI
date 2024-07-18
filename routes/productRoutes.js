const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
} = require("../controllers/productController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route for getting all products and adding a new product
router
  .route("/")
  .get(getAllProducts) // Public access: Users can get all products
  .post(authenticateToken, authorizeRoles("admin"), postProduct); // Admin only: Add a new product

// Route for getting, updating, and deleting a single product by ID
router
  .route("/:id")
  .get(getProduct) // Public access: Users can get a product by ID
  .patch(authenticateToken, authorizeRoles("admin", "manager"), putProduct) // Admin and Manager roles: Update a product by ID
  .delete(authenticateToken, authorizeRoles("admin"), deleteProduct); // Admin only: Delete a product by ID

module.exports = router;
