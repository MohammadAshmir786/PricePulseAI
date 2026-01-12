import express from "express";
import { auth } from "../middleware/auth.js";
import { getRecommendations, getSimilarProductsHandler } from "../controllers/recommendationController.js";

const router = express.Router();

/**
 * GET /api/recommendations
 * Get personalized AI recommendations
 * Public route (works for both logged-in and anonymous users)
 */
router.get("/", auth(false), getRecommendations);

/**
 * GET /api/recommendations/:productId/similar
 * Get similar products for a given product
 */
router.get("/:productId/similar", getSimilarProductsHandler);

export default router;
