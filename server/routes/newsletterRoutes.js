import express from "express";
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
} from "../controllers/newsletterController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/subscribers", auth(), requireRole("admin"), getAllSubscribers);

export default router;
