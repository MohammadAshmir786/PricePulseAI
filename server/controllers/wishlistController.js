import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    items: user.wishlist || [],
    count: user.wishlist?.length || 0,
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if product is already in wishlist
  if (user.wishlist.includes(productId)) {
    throw new AppError("Product already in wishlist", 400);
  }

  user.wishlist.push(productId);
  await user.save();

  const updatedUser = await User.findById(req.user.id).populate("wishlist");
  res.status(201).json({
    message: "Product added to wishlist",
    items: updatedUser.wishlist,
    count: updatedUser.wishlist.length,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Remove product from wishlist
  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId.toString()
  );
  await user.save();

  const updatedUser = await User.findById(req.user.id).populate("wishlist");
  res.json({
    message: "Product removed from wishlist",
    items: updatedUser.wishlist,
    count: updatedUser.wishlist.length,
  });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isInWishlist = user.wishlist.includes(productId);

  if (isInWishlist) {
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
  } else {
    // Add to wishlist
    user.wishlist.push(productId);
  }

  await user.save();

  const updatedUser = await User.findById(req.user.id).populate("wishlist");
  res.json({
    message: isInWishlist
      ? "Product removed from wishlist"
      : "Product added to wishlist",
    inWishlist: !isInWishlist,
    items: updatedUser.wishlist,
    count: updatedUser.wishlist.length,
  });
});

export const checkInWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const inWishlist = user.wishlist.includes(productId);
  res.json({ inWishlist });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.wishlist = [];
  await user.save();

  res.json({
    message: "Wishlist cleared",
    items: [],
    count: 0,
  });
});
