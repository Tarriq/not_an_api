import type { Request, Response } from "express";
import prisma from "../prisma/client.js";

// GET /categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST /categories
export const createCategory = async (req: Request, res: Response) => {
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
};

// DELETE /categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// PATCH /categories/:id
export const editCategory = async (req: Request, res: Response) => {
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
        id,
      },
      data: {
        name: name.toString(),
        description: description.toString(),
      },
    });
    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update category" });
  }
};
