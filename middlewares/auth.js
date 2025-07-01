import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import process from "process";

dotenv.config();

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message); // <-- Use error here
    return res.status(401).json({ message: "Invalid token" });
  }
};
