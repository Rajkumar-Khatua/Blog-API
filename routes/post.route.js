const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  toggleLikePostById,
} = require("../controllers/postControllers.js");

// Create a new post
router.post("/", createPost);

// Get all posts
router.get("/", getAllPosts);

// Get a specific post by ID
router.get("/:postId", getPostById);

// Update a post by ID
router.put("/:postId", updatePostById);
// Like a post by ID
router.put("/:postId/like", toggleLikePostById);

// Delete a post by ID
router.delete("/:postId", deletePostById);

module.exports = router;
