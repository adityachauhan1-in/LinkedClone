import express from 'express'
import mongoose from "mongoose";
import cors  from "cors";
import dotenv from 'dotenv'
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());// we use above because we want to return all data in the form of json

import authRoute from '../backend/routes/authRoute.js'
app.use("/api/auth",authRoute);  

import postRoute from '../backend/routes/postRoute.js'
app.use("/api/posts",postRoute)
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("LinkedIn Clone Backend Running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running ha ni to  on port ${PORT}`));