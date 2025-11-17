import { Router } from "express";
import {
  createStorySave,
  deleteStorySave,
  getSavedStories,
  isStorySaved,
} from "../controllers/saveController.js";

const router = Router();

router.post("/", createStorySave);

router.get("/user/:userId/story/:storyId", isStorySaved);

router.get("/:userId", getSavedStories);

router.delete("/", deleteStorySave);

export default router;
