import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { getRecommendationsForUser, getSimilarProducts } from "../services/recommendationService.js";
import { Product } from "../models/Product.js";

/**
 * Get personalized recommendations for the user
 * If user is logged in, returns AI-powered recommendations based on history
 * If not logged in, returns trending/popular products
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;
  const userId = req.user?.id;

  let recommendations;

  if (userId) {
    // Get AI-powered recommendations for logged-in user
    recommendations = await getRecommendationsForUser(userId);
  } else {
    // Fallback: return trending/popular products for anonymous users
    recommendations = await Product.find()
      .sort({ ratingAverage: -1, ratingCount: -1 })
      .limit(Number(limit));
  }

  res.json({
    success: true,
    count: recommendations.length,
    recommendations: recommendations.slice(0, Number(limit)),
  });
});

/**
 * Get similar products for a specific product
 */
export const getSimilarProductsHandler = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { limit = 5 } = req.query;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const similar = await getSimilarProducts(productId, Number(limit));

  res.json({
    success: true,
    count: similar.length,
    similar_products: similar,
  });
});
