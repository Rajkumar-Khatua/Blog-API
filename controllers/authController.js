const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const jwtUtils = require("../utils/jwtUtils");

console.log("JWT secret - ", process.env.JWT_SECRET);

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user with the hashed password
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // After successful registration, you might want to log in the user automatically
    const token = jwtUtils.generateToken({ user: { _id: newUser._id } });

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      data: "User has been successfully created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    console.log("User", user);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if password is correct
    const isCorrect = await bcrypt.compare(password, user.password);
    console.log("Entered Password:", password);
    console.log("User Password:", user.password);
    console.log("isCorrect:", isCorrect);

    if (!isCorrect) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }

    // Create token using generateToken function from jwtUtils
    const token = jwtUtils.generateToken({
      userId: user._id,
    });

    console.log("JWT Secret Key:", process.env.JWT_SECRET);
    console.log("Token:", token);

    // Send the user and token in the response
    const { password: _, ...userInfo } = user._doc;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        user: userInfo,
        token,
      });
    console.log("Sent Token in Response:", token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Logout user
const logoutUser = (req, res) => {
  // Perform any necessary logout actions

  // Clear the token cookie
  res.clearCookie("token");

  res.json({ success: true, message: "User logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
