import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { calculateCartPricing } from "../utils/orderTotals.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { address, paymentMethod = "COD" } = req.body;
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart empty", 400);
  }

  // Validate stock for all items before creating order
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new AppError(
        `${item.product.name}: Only ${item.product.stock} items available. You have ${item.quantity} in cart.`,
        400
      );
    }
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.finalPrice,
  }));
  const pricing = calculateCartPricing(cart.items);

  const order = await Order.create({
    user: req.user.id,
    items,
    totalAmount: pricing.total,
    pricing: {
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      tax: pricing.tax,
    },
    address,
    paymentStatus: "pending",
    orderStatus: "pending",
    paymentInfo: {
      method: paymentMethod,
    },
  });

  // Decrease stock for each product
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });
  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { user: req.user.id };
  const orders = await Order.find(query).populate("items.product").sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");
  if (!order) throw new AppError("Order not found", 404);
  if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
    throw new AppError("Not authorized to view this order", 403);
  }
  res.json(order);
});
