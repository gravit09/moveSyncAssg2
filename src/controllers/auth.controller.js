import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userLoginSchema, userSignupSchema } from "../utils/validation.js";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const signup = async (req, res) => {
  try {
    const validatedCredentials = userSignupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedCredentials.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(validatedCredentials.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: validatedCredentials.email,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      return res.status(500).json({ error: "User creation failed" });
    }

    res.status(201).json({
      message: "User created successfully",
      email: newUser.email,
      id: newUser.id,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const validatedCredentials = userLoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedCredentials.email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPassValid = await bcrypt.compare(
      validatedCredentials.password,
      user.password
    );

    if (!isPassValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
