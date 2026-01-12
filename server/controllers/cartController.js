import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart || { user: req.user.id, items: [] });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Validate stock
  if (quantity > product.stock) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }
  if (product.stock === 0) {
    throw new AppError("Product out of stock", 400);
  }

  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id, "items.product": productId },
    { $inc: { "items.$.quantity": quantity } },
    { new: true }
  ).populate("items.product");

  // Validate total quantity doesn't exceed stock
  if (cart) {
    const cartItem = cart.items.find((item) => item.product._id.toString() === productId);
    if (cartItem && cartItem.quantity > product.stock) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }
    return res.json(cart);
  }

  const created = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $push: { items: { product: productId, quantity } } },
    { new: true, upsert: true }
  ).populate("items.product");
  res.status(201).json(created);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  if (quantity <= 0) {
    throw new AppError("Quantity must be greater than zero", 400);
  }

  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);

  // Validate stock
  if (quantity > product.stock) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }

  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id, "items.product": productId },
    { $set: { "items.$.quantity": quantity } },
    { new: true }
  ).populate("items.product");
  res.json(cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { items: { product: productId } } },
    { new: true }
  ).populate("items.product");
  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });
  res.json({ success: true });
});
