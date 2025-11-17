import { Router } from "express";
import { createCategory, deleteCategory, editCategory, getCategories } from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategories)

router.post("/", createCategory)

router.delete("/:id", deleteCategory)

router.patch("/:id", editCategory)

export default router;