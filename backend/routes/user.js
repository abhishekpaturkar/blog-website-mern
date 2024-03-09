import express from "express";
import bcrypt from "bcrypt";

import { verifyToken } from "../middlewares/verifyToken.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";

const router = express.Router();

// update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSaltSync(10);
      req.body.password = await bcrypt.hashSync(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in put/user/:id route: ", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ userId: req.params.id });
    await Comment.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    console.log("error delete in router", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    console.log("Error in get/user/:id route: ", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});
const userRoute = router;
export default userRoute;
