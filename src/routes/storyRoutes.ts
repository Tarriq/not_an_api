import { Router } from "express";
import multer from "multer";
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
} from "../controllers/storyController/story.controller.js";
import { createStorySave, deleteStorySave, getSavedStories } from "../controllers/storyController/saves.controller.js";

const upload = multer({ storage: multer.memoryStorage() });

const storyUploads = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "editor_images", maxCount: 10 }
]);

const router = Router();

router.get("/", getStories);

router.get("/s/:id", getStory);

router.get("/hidden", getHiddenStories);

router.post("/", storyUploads, createStory);

router.patch("/:id", storyUploads, editStory);

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
