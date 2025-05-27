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
