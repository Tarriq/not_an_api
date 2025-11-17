import { Router } from "express";
import {
  addRecommendation,
  createStory,
  deleteStory,
  editStory,
  getHiddenStories,
  getRadarStory,
  getRecommendations,
  getStories,
  getStory,
  removeRecommendation,
  republishStory,
  unpublishStory,
  updateRadarStory,
} from "../controllers/storyController.js";

const router = Router();

router.get("/radar", getRadarStory);

router.patch("/radar/:id", updateRadarStory);

router.get("/recommended", getRecommendations);

router.post("/recommended", addRecommendation);

router.delete("/recommended", removeRecommendation);

router.get("/", getStories);

router.get("/hidden", getHiddenStories);

router.get("/:id", getStory);

router.post("/", createStory);

router.patch("/:id", editStory);

router.patch("/:id/unpublish", unpublishStory);

router.patch("/:id/republish", republishStory);

router.delete("/:id", deleteStory);

export default router;
