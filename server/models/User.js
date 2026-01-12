import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    // For local accounts, password is required; for OAuth accounts, it's optional
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    // Auth provider: 'local' for email/password, or OAuth providers
    provider: { type: String, enum: ["local", "google", "github"], default: "local" },
    providerId: { type: String, default: null },
    avatar: { type: String, default: null },
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    // SuperAdmin flag: only superAdmins can create/manage other admins
    isSuperAdmin: { type: Boolean, default: false },
    // Admin privileges for role-based access control
    privileges: {
      type: [String],
      enum: ["manage_products", "manage_orders", "manage_users", "view_analytics"],
      default: [],
    },
    // Wishlist: array of product IDs
    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
  },
  { timestamps: true }
);

// Ensure provider defaults to 'local' if unset/null to satisfy enum
userSchema.pre("validate", function normalizeProvider(next) {
  if (!this.provider) {
    this.provider = "local";
  }
  next();
});

userSchema.pre("save", async function hash(next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function compare(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
