import type { Request, Response } from "express";
import prisma from "../prisma/client.js";

// POST /user
export const createUser = async (req: Request, res: Response) => {
  "use server";

  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: "ID and email are required" });
  }

  try {
    await prisma.user.create({
      data: {
        id,
        email,
        firstName: "",
        lastName: "",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

// GET /user/:id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// PATCH /user/:id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "First name and last name are required" });
  }
  try {
    await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const createSubscriber = async (req: Request, res: Response) => {
  const { email, phone } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Check if email is already in the subscribers list
  const existingSubscriber = await prisma.subscriber.findUnique({
    where: { email },
  });

  if (existingSubscriber) {
    return res.status(400).json({ error: "Email is already subscribed" });
  }

  try {
    await prisma.subscriber.create({
      data: {
        email,
        phone: phone || null,
      },
    });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
};
