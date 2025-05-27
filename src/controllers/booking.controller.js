import { PrismaClient } from "../../generated/prisma/index.js";
import { bookingSchema } from "../utils/validation.js";

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { eventId } = bookingSchema.parse(req.body);
    const userId = req.user.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: "Event with this id not found" });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ error: "No available seats" });
    }

    const checkBooking = await prisma.booking.findFirst({
      where: { eventId, userId },
    });

    if (checkBooking) {
      return res.status(400).json({ error: "You already booked this event" });
    }

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          userId,
          eventId,
        },
      }),
      prisma.event.update({
        where: { id: eventId },
        data: {
          availableSeats: {
            decrement: 1,
          },
        },
      }),
    ]);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id, userId },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking with this id not found" });
    }

    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const [updatedBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { status: "Cancelled" },
      }),
      prisma.event.update({
        where: { id: booking.eventId },
        data: {
          availableSeats: {
            increment: 1,
          },
        },
      }),
    ]);

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
