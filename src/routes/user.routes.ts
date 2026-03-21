import { Router } from "express";
import { createSubscriber, deleteSubscriber, getUsers } from "../controllers/user/user.controller.js";

const router = Router();

router.get("/", getUsers)

router.post("/subscribe", createSubscriber);

router.delete("/unsubscribe", deleteSubscriber);

export default router;