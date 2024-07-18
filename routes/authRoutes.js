// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  deleteUsersByRole,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRoles = require("../middleware/authorizeRoles");

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// Get all users (Admin and Manager roles)
router.get(
  "/getAllUsers",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  getAllUsers
);

// Delete a user by ID (Admin and Manager roles)
router.delete(
  "/deleteUser/:id",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  deleteUser
);

// Delete all users with a specific role (Admin only)
router.delete(
  "/deleteUsers/:role",
  authenticateToken,
  authorizeRoles("admin"),
  deleteUsersByRole
);

module.exports = router;
