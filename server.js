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

// ✅ Updated CORS config
const allowedOrigins = [
  "http://localhost:5173",
  "https://21-10-assignment.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
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
    // Listen on 0.0.0.0 to accept remote connections
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));