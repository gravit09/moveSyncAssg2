import z from "zod";

export const userSignupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password too short, must be at least 6 characters"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});

export const eventCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dateTime: z.string().datetime("Invalid date format"),
  location: z.string().min(1, "location is required"),
  totalSeats: z.number().int().positive("total seats must be positive"),
});

export const bookingSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export const eventUpdateSchema = eventCreateSchema.partial();
