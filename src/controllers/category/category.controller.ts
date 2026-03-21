import type { Request, Response } from "express";
import { prisma } from "@/prisma/index.js";

// GET /categories
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function getActiveCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        stories: {
          some: {},
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch active categories" });
  }
}

// POST /categories
export async function createCategory(req: Request, res: Response) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }

    await prisma.category.create({
      data: {
        name: name.toString(),
        description: description.toString(),
      },
    });

    res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create category" });
  }
}

// DELETE /categories/:id
export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    await prisma.category.delete({
      where: {
        id: id as string,
      },
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
}

// PATCH /categories/:id
export async function editCategory(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }
  try {
    await prisma.category.update({
      where: {
        id: id as string,
      },
      data: {
        name: name.toString(),
        description: description.toString(),
      },
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update category" });
  }
}
