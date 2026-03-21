import type { Request, Response } from "express";
import { prisma } from "@/prisma/index.js";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({ orderBy: { role: "asc" } });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
export async function createSubscriber(req: Request, res: Response) {
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
        alreadySubscribed: true,
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
}

export async function deleteSubscriber(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (!existingSubscriber) {
      return res.status(404).json({ error: "Email not found in our records" });
    }

    await prisma.subscriber.delete({
      where: { email },
    });

    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("DELETE_SUBSCRIBER_ERROR:", error);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
}
