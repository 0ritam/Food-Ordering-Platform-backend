import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { createToken } from "../utils/token.js";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    await prisma.cart.create({
      data: { userId: newUser.id },
    });

    const token = createToken(newUser.id);

    res.status(201).json({
      token,
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = createToken(user.id);

    res.status(200).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
