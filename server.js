import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import process from "process";
import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import dogRoutes from "./routes/dogRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dogs", dogRoutes);

// Global error handler (optional)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Server error" });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for testing
export default app;
