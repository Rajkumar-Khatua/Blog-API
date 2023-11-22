const Post = require("../models/Post.js");
const User = require("../models/User.js");

// Create a new post
const createPost = async (req, res) => {
  const { title, content, image, tags } = req.body;

  try {
    // Assuming you have a middleware that sets the user in the request object
    const author = req.user; // Assuming req.user contains the user ID

    // Check if author is present
    if (!author) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated or invalid user",
      });
    }

    // Create a new post with the authenticated user's ID as the author
    const post = await Post.create({ title, content, author, image, tags });

    // Update the user's posts array with the new post ID
    await User.findByIdAndUpdate(author, { $push: { posts: post._id } });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get a specific post by ID
const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Update a post by ID
const updatePostById = async (req, res) => {
  const { postId } = req.params;
  const { title, content, image, tags } = req.body;
  const userId = req.user; // Assuming req.user contains the user ID

  try {
    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to update this post",
      });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, image, tags },
      { new: true }
    );

    // Update the post in the user's posts array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { posts: postId } } // Remove the old post ID
    );
    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: updatedPost._id } } // Add the updated post ID
    );

    res.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Delete a post by ID
const deletePostById = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user; // Assuming req.user contains the user ID

  try {
    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to delete this post",
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Remove the post ID from the user's posts array
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    res.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
