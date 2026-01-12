import express from "express";
import { auth } from "../middleware/auth.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router({ mergeParams: true });

router.get("/:productId", getReviews);
router.post("/", auth(), addReview);

export default router;
