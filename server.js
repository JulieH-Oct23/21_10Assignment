import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import process from "process";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dogRoutes from "./routes/dogRoutes.js";

dotenv.config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI ? "YES" : "NO");
console.log("Loaded ALLOWED_ORIGINS:", process.env.ALLOWED_ORIGINS);
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET ? "YES" : "NO");

const app = express();
const PORT = process.env.PORT || 4000;

// Allowed origins whitelist
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

// CORS options to allow only whitelisted origins and handle preflight OPTIONS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Enable preflight requests for all routes
app.options("*", cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/dogs", dogRoutes);

// Simple test route to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));