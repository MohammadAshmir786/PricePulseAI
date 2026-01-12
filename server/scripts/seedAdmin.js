import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

const adminUser = {
  name: "Admin",
  email: "admin@pricepulse.ai",
  password: "admin123", // Will be hashed by the User model pre-save hook
  role: "admin",
};

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Check if admin already exists
    const existing = await User.findOne({ email: adminUser.email });
    if (existing) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    await User.create(adminUser);
    console.log("✓ Admin user created successfully");
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: admin123`);
    console.log(`  Role: admin`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seedAdmin();
