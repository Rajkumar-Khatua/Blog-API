const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authMiddleware = require("./middleware/authMiddleware.js");

dotenv.config();

// Import routes
// const authRoutes = require("../api/routes/auth.route.js");
// const userRoutes = require("../api/routes/user.route.js");
// const postRoutes = require("../api/routes/post.route.js");

const authRoutes = require("./routes/auth.route.js");
const userRoutes = require("./routes/user.route.js");
const postRoutes = require("./routes/post.route.js");


// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Apply the authMiddleware to protect routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes); // Protect user routes
app.use("/api/posts", authMiddleware, postRoutes); // Protect post routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

console.log(process.env.MONGO_URI);
// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
