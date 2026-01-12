import mongoose from "mongoose";
import dotenv from "dotenv";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

dotenv.config();

const reviewComments = [
  "Absolutely love this product! Worth every penny.",
  "Great quality and fast shipping. Highly recommend!",
  "Exactly what I was looking for. Very satisfied with my purchase.",
  "Good product but took longer to arrive than expected.",
  "Amazing! Exceeded my expectations in every way.",
  "Decent product for the price. Does what it says.",
  "Not bad, but I've seen better. Still satisfied overall.",
  "Perfect! This is my second purchase and still impressed.",
  "Works great! Simple to use and good build quality.",
  "Excellent value for money. Would buy again.",
  "Pretty good, though shipping could be faster.",
  "Fantastic product! Already recommended to friends.",
  "Very happy with this purchase. Top notch quality.",
  "Does the job well. No complaints so far.",
  "Love it! Best purchase I've made in a while.",
];

function getRandomComment() {
  return reviewComments[Math.floor(Math.random() * reviewComments.length)];
}

function getRandomRating() {
  // Weight towards higher ratings (more realistic)
  const weights = [1, 2, 5, 15, 30]; // 1*, 2*, 3*, 4*, 5*
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) return i + 1;
    random -= weights[i];
  }
  return 5;
}

async function seedReviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Get all products and users
    const products = await Product.find();
    const users = await User.find({ role: "customer" });

    if (products.length === 0) {
      console.log("No products found. Please seed products first.");
      process.exit(1);
    }

    if (users.length === 0) {
      console.log("No customer users found. Creating sample users...");

      // Create sample users for reviews
      const sampleUsers = [
        { name: "John Doe", email: "john@example.com", password: "password123", role: "customer" },
        { name: "Jane Smith", email: "jane@example.com", password: "password123", role: "customer" },
        { name: "Mike Johnson", email: "mike@example.com", password: "password123", role: "customer" },
        { name: "Sarah Williams", email: "sarah@example.com", password: "password123", role: "customer" },
        { name: "David Brown", email: "david@example.com", password: "password123", role: "customer" },
      ];

      await User.insertMany(sampleUsers);
      console.log("✓ Created sample users");

      // Refetch users
      const newUsers = await User.find({ role: "customer" });
      users.push(...newUsers);
    }

    // Clear existing reviews (optional)
    // await Review.deleteMany({});
    // console.log("Cleared existing reviews");

    const reviews = [];

    // Create 2-5 reviews per product
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 reviews
      const usedUsers = new Set();

      for (let i = 0; i < numReviews && usedUsers.size < users.length; i++) {
        // Pick a random user that hasn't reviewed this product yet
        let randomUser;
        do {
          randomUser = users[Math.floor(Math.random() * users.length)];
        } while (usedUsers.has(randomUser._id.toString()));

        usedUsers.add(randomUser._id.toString());

        reviews.push({
          user: randomUser._id,
          product: product._id,
          rating: getRandomRating(),
          comment: getRandomComment(),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        });
      }
    }

    // Insert reviews
    await Review.insertMany(reviews);
    console.log(`✓ Seeded ${reviews.length} reviews`);

    // Update product ratings
    console.log("Updating product ratings...");
    for (const product of products) {
      const stats = await Review.aggregate([
        { $match: { product: product._id } },
        {
          $group: {
            _id: "$product",
            avg: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      if (stats[0]) {
        await Product.findByIdAndUpdate(product._id, {
          ratingAverage: stats[0].avg,
          ratingCount: stats[0].count,
        });
      }
    }
    console.log("✓ Updated product ratings");

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seedReviews();
