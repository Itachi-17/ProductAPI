// controllers/authController.js
const User = require("../models/userModels"); // Correcting file name to singular
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  res.status(201).json({ message: "User registered successfully" });
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

// Get all users (Admin and Manager only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Delete a user by ID (Admin and Manager)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const currentUserRole = req.user.role;
  if (
    currentUserRole === "admin" &&
    (user.role === "user" || user.role === "manager")
  ) {
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } else if (currentUserRole === "manager" && user.role === "user") {
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(403);
    throw new Error("Not authorized to delete this user");
  }
});

// Delete all users with a specific role (Admin)
const deleteUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Not authorized to delete users by role" });
  }

  if (role !== "user" && role !== "manager") {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  const result = await User.deleteMany({ role });

  if (result.deletedCount === 0) {
    throw new Error(`No users found with role ${role}`);
  }

  res.status(200).json({
    message: `${result.deletedCount} users with role ${role} deleted successfully`,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  deleteUsersByRole,
};
