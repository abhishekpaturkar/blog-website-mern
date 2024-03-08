import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// dotenv config
dotenv.config();

// imports from file
import { connectToDB } from "./db/connectToDB.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import postRoute from "./routes/posts.js";
import commentRoute from "./routes/comment.js";

// Constants
const app = express();
const PORT = process.env.PORT || 3001;

// Middleaware
app.use(cookieParser());
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on port ${PORT}`);
});
