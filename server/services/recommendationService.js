import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { Review } from "../models/Review.js";
import { aiService } from "./aiService.js";

export async function getRecommendationsForUser(userId) {
  try {
    // Get all products
    const products = await Product.find().limit(100);
    const productIds = products.map((p) => p._id.toString());

    // Get user's purchase and review history
    const userHistory = await getUserHistory(userId);

    // Call AI service for personalized recommendations
    const recommendedIds = await aiService.getRecommendations(
      userId,
      productIds,
      userHistory,
      8
    );

    // Return products in recommended order
    const recommended = products.filter((p) =>
      recommendedIds.includes(p._id.toString())
    );

    // Sort by recommendation order
    recommended.sort(
      (a, b) =>
        recommendedIds.indexOf(a._id.toString()) -
        recommendedIds.indexOf(b._id.toString())
    );

    return recommended;
  } catch (error) {
    console.error("[RecommendationService] Error:", error.message);
    // Fallback: return popular products
    return Product.find()
      .sort({ ratingAverage: -1, ratingCount: -1 })
      .limit(8);
  }
}

export async function getSimilarProducts(productId, limit = 5) {
  try {
    const product = await Product.findById(productId);
    if (!product) return [];

    const allProducts = await Product.find({ _id: { $ne: productId } }).limit(
      50
    );

    const productFeatures = {
      category: product.category,
      tags: product.tags,
      basePrice: product.basePrice,
      _id: product._id.toString(),
    };

    const similarIds = await aiService.getSimilarProducts(
      productId,
      productFeatures,
      allProducts.map((p) => ({
        _id: p._id.toString(),
        category: p.category,
        tags: p.tags,
        basePrice: p.basePrice,
      })),
      limit
    );

    const similar = allProducts.filter((p) =>
      similarIds.includes(p._id.toString())
    );

    return similar;
  } catch (error) {
    console.error("Similar products error:", error);
    // Fallback: return products from same category
    const product = await Product.findById(productId);
    return Product.find({
      _id: { $ne: productId },
      category: product?.category,
    }).limit(limit);
  }
}

async function getUserHistory(userId) {
  if (!userId) return [];

  try {
    // Get user's reviews
    const reviews = await Review.find({ user: userId })
      .select("product rating")
      .lean();

    return reviews.map((r) => ({
      productId: r.product.toString(),
      rating: r.rating,
    }));
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
}
