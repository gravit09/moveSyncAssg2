import express from "express";
import {
  createBooking,
  getUserBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getUserBookings);
router.delete("/:id", authMiddleware, cancelBooking);

export default router;
