import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// dotenv config
dotenv.config();

// imports from file
import { connectToDB } from "./db/connectToDB.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import postRoute from "./routes/posts.js";
import commentRoute from "./routes/comment.js";
import multer from "multer";

// Constants
const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve();

// Middleaware

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/backend", "/images")));
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("Image has been uploaded successfully");
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on port ${PORT}`);
});
