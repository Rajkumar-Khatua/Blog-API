// routes/user.route.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userControllers.js");

// Apply authMiddleware to protect routes
router.use(authMiddleware);

// Get all users
router.get("/", getAllUsers);

// Get a specific user by ID
router.get("/:userId", getUserById);

// Update a user by ID
router.put("/:userId", updateUserById);

// Delete a user by ID
router.delete("/:userId", deleteUserById);

module.exports = router;
