import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ MongoDB connected");
  } catch (err) {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// User schema definition
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    provider: { type: String, enum: ["local", "google", "github"], default: "local" },
    providerId: { type: String, default: null },
    avatar: { type: String, default: null },
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    isSuperAdmin: { type: Boolean, default: false },
    privileges: {
      type: [String],
      enum: ["manage_products", "manage_orders", "manage_users", "view_analytics"],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hash(next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

const User = mongoose.model("User", userSchema);

async function seedSuperAdmin() {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "superadmin@pricepulse.com";
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";
    const superAdminName = process.env.SUPER_ADMIN_NAME || "Super Admin";

    // Check if superAdmin already exists
    const existingAdmin = await User.findOne({ email: superAdminEmail });
    if (existingAdmin) {
      console.log("✓ SuperAdmin already exists:", superAdminEmail);
      return;
    }

    // Create superAdmin
    const superAdmin = new User({
      name: superAdminName,
      email: superAdminEmail,
      password: superAdminPassword,
      role: "admin",
      isSuperAdmin: true,
      privileges: ["manage_products", "manage_orders", "manage_users", "view_analytics"],
      provider: "local",
    });

    await superAdmin.save();
    console.log("✓ SuperAdmin created successfully!");
    console.log("  Email:", superAdminEmail);
    console.log("  Name:", superAdminName);
    console.log("\n⚠️  IMPORTANT: Change the default password immediately!");
    console.log("   You can:");
    console.log("   1. Set SUPER_ADMIN_PASSWORD env variable before running this script");
    console.log("   2. Update the password through the app after login");
  } catch (err) {
    console.error("✗ Error seeding superAdmin:", err.message);
  }
}

async function main() {
  try {
    await connectDB();
    await seedSuperAdmin();
    console.log("\n✓ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("✗ Seeding failed:", err);
    process.exit(1);
  }
}

main();
