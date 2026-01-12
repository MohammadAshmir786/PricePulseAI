import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

async function refreshProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  const info = stats[0];
  if (info) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: info.avg,
      ratingCount: info.count,
    });
  }
  return info;
}

export const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || rating == null) throw new AppError("Product ID and rating are required", 400);
  const review = await Review.findOneAndUpdate(
    { user: req.user.id, product: productId },
    { rating, comment },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  if (!review) throw new AppError("Failed to add or update review", 500);
  const info = await refreshProductRating(review.product);
  if (!info) throw new AppError("Failed to refresh product rating", 500);
  res.status(201).json(review);
});

export const getReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new AppError("Product ID is required", 400);

  const reviews = await Review.find({ product: productId }).populate("user", "name");
  if (reviews.length === 0) throw new AppError("No reviews found for this product", 404);

  res.json(reviews);
});
