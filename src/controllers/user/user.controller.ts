import type { Request, Response } from "express";
import { prisma } from "@/prisma/index.js";

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

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = Array.isArray(req.params) ? req.params[0] : req.params;

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

    res.status(201).send()
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

  try {
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return res.status(200).json({ 
        message: "Email already subscribed", 
        alreadySubscribed: true 
      });
    }

    await prisma.subscriber.create({
      data: {
        email,
        phone: phone || null,
      },
    });

    res.status(201).json({ message: "Thanks for subscribing!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
};