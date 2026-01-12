import express from "express";
import rateLimit from "express-rate-limit";
import { chat } from "../controllers/supportController.js";

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many chat requests right now. Please wait a moment." }
});

router.post("/chat", chatLimiter, chat);

export default router;
