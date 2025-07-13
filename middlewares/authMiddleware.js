import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import process from "process";

dotenv.config();

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize user id
    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id,
      id: decoded._id || decoded.id,
    };

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};