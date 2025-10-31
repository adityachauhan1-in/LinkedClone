import express from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import User from "../models/User.js";
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
 // if failed to verify token 
  if (!authHeader) 
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) 
        return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Create post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
       const newPost = await Post.create({ user: req.user.id, text });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts 
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// for like and unlike the post 
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
      const post = await Post.findById(req.params.id); // first verify
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);

    } else {
      post.likes.push(userId);
    }

    await post.save();
    
    res.json({ success: true, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
