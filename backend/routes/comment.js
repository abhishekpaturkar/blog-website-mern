import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import Comment from "../models/comment.js";

const router = express.Router();

// create
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    console.log("Error in comment /create", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    console.log("Error in comment put /:id", error.message);
    res.status(500).json({ message: error.message });
  }
});

// delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    console.log("Error in comment delete /:id", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get post comment
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (error) {
    console.log("Error in comment by post /post/:postId", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
