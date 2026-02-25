import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getActiveCategories,
  getCategories,
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getCategories);

router.get("/active", getActiveCategories);

router.post("/", createCategory);

router.delete("/:id", deleteCategory);

router.patch("/:id", editCategory);

export default router;
