import { PrismaClient } from "../../generated/prisma/index.js";
import { eventCreateSchema, eventUpdateSchema } from "../utils/validation.js";

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  try {
    const validatedEvent = eventCreateSchema.parse(req.body);
    const { dateTime, ...eventData } = validatedEvent;

    const newEvent = await prisma.event.create({
      data: {
        ...eventData,
        date: new Date(dateTime),
        availableSeats: eventData.totalSeats,
      },
    });

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedEvent = eventUpdateSchema.parse(req.body);
    const { dateTime, ...eventData } = validatedEvent;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        ...(dateTime && { date: new Date(dateTime) }),
      },
    });

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await prisma.event.delete({
      where: { id },
    });
    res.status(200).json({
      message: "Event deleted successfully",
      event: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const take = parseInt(limit);
    const totalEvents = await prisma.event.count();
    const totalPages = Math.ceil(totalEvents / take);
    const events = await prisma.event.findMany({
      skip,
      take,
      orderBy: { date: "asc" },
    });
    res.status(200).json({
      message: "Events fetched successfully",
      events,
      totalEvents,
      totalPages,
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found check id" });
    }

    res.status(200).json({
      message: "Event fetched successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
