import Razorpay from "razorpay";
import crypto from "crypto";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { calculateCartPricing } from "../utils/orderTotals.js";
import dotenv from "dotenv";
dotenv.config();

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new AppError("Payment gateway not configured", 500);
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function ensureCartIsValid(cart) {
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart empty", 400);
  }

  for (const item of cart.items) {
    if (!item.product) {
      throw new AppError("One of the items no longer exists", 400);
    }
    if (item.quantity > item.product.stock) {
      throw new AppError(
        `${item.product.name}: Only ${item.product.stock} items available. You have ${item.quantity} in cart.`,
        400
      );
    }
  }
}

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const razorpay = getRazorpayClient();
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  ensureCartIsValid(cart);

  const pricing = calculateCartPricing(cart.items);
  const amountInPaise = Math.round(pricing.total * 100);

  if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
    throw new AppError("Cart total must be at least ₹1 to pay online.", 400);
  }

  let gatewayOrder;
  try {
    console.log("razorpay order creation.....", { amountInPaise, pricing, user: req.user.id });
    gatewayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      // Keep receipt under 40 chars: short user suffix + timestamp suffix
      receipt: `pp_${req.user.id.slice(-6)}_${Date.now().toString().slice(-8)}`,
      payment_capture: 1,
      notes: {
        userId: req.user.id.toString(),
      },
    });
    console.log("razorpay order created.....", gatewayOrder?.id, gatewayOrder?.status, gatewayOrder?.amount);
  } catch (err) {
    const providerMessage = err?.error?.description || err?.message || "Payment order creation failed";
    console.error("Razorpay order creation error", providerMessage);
    throw new AppError(providerMessage, 400);
  }

  res.json({
    orderId: gatewayOrder.id,
    amount: gatewayOrder.amount,
    currency: gatewayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
    pricing,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address, paymentMethod } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError("Invalid payment details", 400);
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new AppError("Payment gateway not configured", 500);
  }

  const signatureCheck = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (signatureCheck !== razorpay_signature) {
    throw new AppError("Payment verification failed", 400);
  }

  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  ensureCartIsValid(cart);

  const pricing = calculateCartPricing(cart.items);
  const items = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.finalPrice,
  }));

  const order = await Order.create({
    user: req.user.id,
    items,
    totalAmount: pricing.total,
    address,
    paymentStatus: "paid",
    orderStatus: "processing",
    paymentInfo: {
      provider: "razorpay",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      method: paymentMethod || "online",
    },
  });

  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });

  res.json({ order, pricing });
});
