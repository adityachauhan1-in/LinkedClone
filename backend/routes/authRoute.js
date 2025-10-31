import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
// for navbar profile section 
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

//  for Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // to check is user already exist or not 
    const existingUser = await User.findOne({ email });
    if (existingUser) 
        return res.status(400).json({ message: "User already exists" });
// hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  for Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // find the user with the email 
    // check the user is user exist or not 
    if (!user) 
        return res.status(400).json({ message: "User not found" });
 // check the details filled by the user 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
        return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, name: user.name }, // jsonwebtoken which will expire in 1 day 
         process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// for showing the user info at the top 
router.get("/me",verifyToken,async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
