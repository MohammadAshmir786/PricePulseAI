import { Newsletter } from "../models/Newsletter.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  // Check if already subscribed
  const existing = await Newsletter.findOne({ email });

  if (existing) {
    if (existing.status === "active") {
      throw new AppError("Email is already subscribed", 400);
    }

    // Reactivate if previously unsubscribed
    existing.status = "active";
    existing.subscribedAt = Date.now();
    existing.unsubscribedAt = undefined;
    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Successfully resubscribed to newsletter",
    });
  }

  // Create new subscription
  await Newsletter.create({ email });

  res.status(201).json({
    success: true,
    message: "Successfully subscribed to newsletter",
  });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const subscriber = await Newsletter.findOne({ email });

  if (!subscriber) {
    throw new AppError("Email not found in newsletter list", 404);
  }

  subscriber.status = "unsubscribed";
  subscriber.unsubscribedAt = Date.now();
  await subscriber.save();

  res.status(200).json({
    success: true,
    message: "Successfully unsubscribed from newsletter",
  });
});

export const getAllSubscribers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const subscribers = await Newsletter.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: subscribers.length,
    data: subscribers,
  });
});
