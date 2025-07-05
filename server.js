// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import process from "process";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dogRoutes from "./routes/dogRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Smart CORS Setup
const rawOrigins = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = rawOrigins.split(",").map(origin => origin.trim());

const matchOrigin = (origin) => {
  if (!origin) return true; // allow curl/Postman
  return allowedOrigins.some(allowed => {
    if (allowed.includes("*")) {
      const regex = new RegExp("^" + allowed.replace(/\*/g, ".*") + "$");
      return regex.test(origin);
    }
    return origin === allowed;
  });
};

app.use(cors({
  origin: function (origin, callback) {
    console.log("🌐 CORS Origin:", origin);
    if (matchOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dogs", dogRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

// DB & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));