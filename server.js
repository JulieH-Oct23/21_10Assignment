// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import process from "process";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dogRoutes from "./routes/dogRoutes.js"; // ✅ Add dog routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // ✅ Authentication routes
app.use("/api/dogs", dogRoutes);  // ✅ Dog-related routes

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

// MongoDB connection & server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));