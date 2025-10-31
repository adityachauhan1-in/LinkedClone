import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

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

export default router;
