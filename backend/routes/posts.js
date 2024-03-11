import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import Post from "../models/post.js";
const router = express.Router();

// Create
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();

    res.status(200).json(savedPost);
  } catch (error) {
    console.log("Error in post /create route", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log("Error in post put /:id", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json("Post has been deleted");
  } catch (error) {
    console.log("Error in post delete /:id", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get post details
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    console.log("Error in get post by id /get", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get Posts
router.get("/", async (req, res) => {
  const query = req.query;

  try {
    const searchFilter = {
      title: { $regex: query.search, $options: "i" },
    };
    const posts = await Post.find(query.search ? searchFilter : null);
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in get posts /get", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get User Posts
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in get user's post /get", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
