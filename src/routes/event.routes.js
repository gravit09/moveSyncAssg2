import express from "express";
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from "../controllers/event.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

export default router;
