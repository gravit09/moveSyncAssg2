import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Auth token is missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid auth token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error", error);
    res.status(401).json({ error: "Auth failed" });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Access denied only for admin" });
  }
  next();
};
