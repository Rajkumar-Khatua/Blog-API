const bcrypt = require("bcrypt");

const User = require("../models/User.js");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Update a user by ID, including password update
const updateUserById = async (req, res) => {
  const { userId } = req.params;
  const { username, email, profileImage, bio, password } = req.body;

  try {
    // Find the user by its unique identifier
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if the requesting user is the owner of the account
    if (user._id.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to update this user",
      });
    }

    // Update the user properties
    user.username = username || user.username;
    user.email = email || user.email;
    user.profileImage = profileImage || user.profileImage;
    user.bio = bio || user.bio;

    // Check if the password is provided and update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with success and the updated user data
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    // Handle server errors by logging and providing an error response
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by its unique identifier
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if the requesting user is the owner of the account
    if (user._id.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to delete this user",
      });
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    // Respond with success and the deleted user data
    res.json({ success: true, data: deletedUser });
  } catch (error) {
    // Handle server errors by logging and providing an error response
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = { getAllUsers, getUserById, updateUserById, deleteUserById };
