import { Router } from "express";
import { createSubscriber, createUser, getUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/:id", getUser);

router.post("/", createUser);

router.patch("/:id", updateUser);

router.post("/subscribe", createSubscriber);

export default router;