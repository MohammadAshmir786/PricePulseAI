import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { recomputePrice } from "../services/priceService.js";
import { searchAndCreateProduct, syncProductPrices } from "../services/productService.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { q, category, limit = 20, page = 1 } = req.query;
  const filter = {};

  // Support both text search and substring/number queries
  if (q) {
    const regex = { $regex: q, $options: "i" };
    // Prefer text index when available, but also match numeric/substrings via regex
    filter.$or = [{ name: regex }, { description: regex }, { tags: regex }];
  }

  if (category) {
    filter.category = category;
  }

  const docs = await Product.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });
  const total = await Product.countDocuments(filter);
  res.json({ items: docs, total });
});

export const listCategories = asyncHandler(async (_req, res) => {
  const cats = await Product.distinct("category");
  if (!cats || cats.length === 0) {
    throw new AppError("No categories found", 404);
  }
  res.json({ categories: cats });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.name || !payload.category || !payload.basePrice) {
    throw new AppError("Missing required fields", 400);
  }
  const product = await Product.create(payload);
  if (!product) {
    throw new AppError("Failed to create product", 500);
  }
  const priced = await recomputePrice(product._id);
  if (!priced) {
    throw new AppError("Failed to recompute price", 500);
  }
  res.status(201).json(priced || product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  const priced = await recomputePrice(product._id);
  if (!priced) {
    throw new AppError("Failed to recompute price", 500);
  }
  res.json(priced || product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    throw new AppError("Product not found", 404);
  }
  res.json({ success: true });
});

export const searchProduct = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    throw new AppError("Product name required", 400);
  }
  const product = await searchAndCreateProduct(name);
  if (!product) {
    throw new AppError("Product not found on web", 404);
  }
  res.status(201).json(product);
});

export const syncPrices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await syncProductPrices(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.json(product);
});
