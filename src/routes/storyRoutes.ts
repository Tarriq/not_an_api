import { Router } from "express";
import {
  getRadarStory,
  updateRadarStory,
} from "../controllers/storyController/radar.controller.js";
import {
  addRecommendation,
  getRecommendations,
  removeRecommendation,
} from "../controllers/storyController/recommendations.controller.js";
import {
  createStory,
  deleteStory,
  editStory,
  getHiddenStories,
  getStories,
  getStory,
  republishStory,
  unpublishStory,
} from "../controllers/storyController/stories.controller.js";
import { createStorySave, deleteStorySave, getSavedStories } from "../controllers/storyController/saves.controller.js";

const router = Router();

router.get("/", getStories);

router.get("/s/:id", getStory);

router.get("/hidden", getHiddenStories);

router.post("/", createStory);

router.patch("/:id", editStory);

router.patch("/republish/:id", republishStory);

router.patch("/unpublish/:id", unpublishStory);

// router.delete("/:id", deleteStory);

// ------------------ Radar ------------------

router.get("/radar", getRadarStory);

router.patch("/radar/:id", updateRadarStory);

// ------------- Recommendations -------------

router.get("/recommended", getRecommendations);

router.patch("/:id/recommend", addRecommendation);

router.delete("/:id/recommend", removeRecommendation);

// -------------------Saves ------------------

router.get("/saved/:userId", getSavedStories);

router.post("/save", createStorySave);

router.delete("/save", deleteStorySave);

export default router;
