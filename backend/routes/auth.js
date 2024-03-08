import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const router = express.Router();

// register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const isUserExist = await User.findOne({ email });
    const isEmailExist = await User.findOne({ username });
    if (isUserExist || isEmailExist) {
      return res.status(400).json({
        message: "User already exist",
      });
      //   throw new Error("User already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    // console.log(saveUser);
    res.status(201).json({
      message: "User created successfully",
      saveUser,
    });
  } catch (error) {
    console.log("Error in /register route: ", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist, please register",
      });
    }
    // console.log(user);
    const match = await bcrypt.compare(req.body.password, user.password);
    // console.log("Match", match);
    if (!match) {
      return res.status(401).json("Wrong credentials!");
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    const { password, ...info } = user._doc;
    res.cookie("token", token).status(200).json(info);
  } catch (error) {
    console.log("Error in /login route: ", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("User logged out successfully!");
  } catch (error) {
    console.log("Error in /logout route: ", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// refetch user
router.get("/refetch", async (req, res) => {
  try {
    const token = req.cookies.token;
    const data = await jwt.verify(token, process.env.SECRET);
    res.status(200).json(data);
  } catch (error) {
    console.log("Error in /refetch route: ", error.message);
    res.status(404).json(error);
  }
});

const authRoute = router;

export default authRoute;
