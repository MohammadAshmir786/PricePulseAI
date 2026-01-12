import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { sendPasswordResetOTP } from "../services/emailService.js";
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";

function signAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, isSuperAdmin: user.isSuperAdmin || false, privileges: user.privileges || [] },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
}

function signRefreshToken(user, rememberMe = false) {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  const expiresIn = rememberMe ? "30d" : "7d";
  return jwt.sign(
    { id: user._id, role: user.role, isSuperAdmin: user.isSuperAdmin || false, privileges: user.privileges || [] },
    secret,
    { expiresIn }
  );
}

function setRefreshCookie(res, token, rememberMe = false) {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  res.cookie("pp_refresh", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, rememberMe } = req.body;
  if (!name || !email || !password) {
    throw new AppError("Missing required fields", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("User already exists", 409);
  }

  const user = await User.create({ name, email, password });
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, rememberMe);
  setRefreshCookie(res, refreshToken, rememberMe);
  return res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, rememberMe);
  setRefreshCookie(res, refreshToken, rememberMe);
  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: accessToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.pp_refresh;
  if (!token) {
    throw new AppError("No refresh token", 401);
  }
  try {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("name email role isSuperAdmin privileges");
    if (!user) {
      throw new AppError("Invalid refresh token", 401);
    }
    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    setRefreshCookie(res, newRefresh);
    return res.json({ token: newAccess });
  } catch (err) {
    throw new AppError("Invalid refresh token", 401);
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("pp_refresh", { path: "/" });
  return res.json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Unauthorized", 401);
  }
  const user = await User.findById(id).select("name email role isSuperAdmin privileges createdAt avatar");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return res.json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("Email already in use", 409);
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (avatar || avatar === "") user.avatar = avatar;

  await user.save();
  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

export const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await User.deleteOne({ _id: user._id });
  res.clearCookie("pp_refresh", { path: "/" });
  return res.json({ message: "Account deleted" });
});

// OAuth success handler: issue JWTs and redirect to client with access token
export const oauthSuccess = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.redirect(`${getClientOrigin()}/login?error=oauth`);
  }
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, true);
  setRefreshCookie(res, refreshToken, true);
  const redirectUrl = new URL("/oauth/callback", getClientOrigin());
  redirectUrl.searchParams.set("token", accessToken);
  const next = req.query?.state || "/";
  redirectUrl.searchParams.set("next", next);
  return res.redirect(redirectUrl.toString());
});

function getClientOrigin() {
  const origins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
  return origins?.[0] || "http://localhost:5173";
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required", 400);

  const user = await User.findOne({ email });
  // Do not reveal whether the email exists for privacy; proceed silently
  if (user) {
    const otp = generateOTP();
    user.resetOTP = await bcrypt.hash(otp, 10);
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    try {
      await sendPasswordResetOTP(email, otp);
    } catch (err) {
      throw new AppError("Failed to send OTP", 500);
    }
  }
  return res.json({ message: "OTP sent to email" });
});

export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new AppError("Email and OTP are required", 400);
  const user = await User.findOne({ email });
  if (!user || !user.resetOTP || !user.resetOTPExpires) {
    throw new AppError("Invalid request", 400);
  }
  if (user.resetOTPExpires < new Date()) {
    throw new AppError("OTP expired", 400);
  }
  const isValid = await bcrypt.compare(otp, user.resetOTP);
  if (!isValid) throw new AppError("Invalid OTP", 400);
  return res.json({ message: "OTP verified" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email and new password are required", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.updateOne(
    { email },
    { password: hashedPassword, resetOTP: null, resetOTPExpires: null }
  );

  return res.json({ message: "Password reset successful" });
});
// Admin management endpoints
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, privileges } = req.body;

  // Verify requesting user is superAdmin
  if (!req.user || req.user.role !== "admin" || !req.user.isSuperAdmin) {
    throw new AppError("Only superAdmins can create other admins", 403);
  }

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("User with this email already exists", 409);
  }

  const validPrivileges = ["manage_products", "manage_orders", "manage_users", "view_analytics"];
  const selectedPrivileges = (privileges || []).filter((p) => validPrivileges.includes(p));

  const newAdmin = await User.create({
    name,
    email,
    password,
    role: "admin",
    isSuperAdmin: false,
    privileges: selectedPrivileges,
  });

  return res.status(201).json({
    message: "Admin created successfully",
    admin: {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      isSuperAdmin: newAdmin.isSuperAdmin,
      privileges: newAdmin.privileges,
    },
  });
});

export const listAdmins = asyncHandler(async (req, res) => {
  // Verify requesting user is superAdmin
  if (!req.user || req.user.role !== "admin" || !req.user.isSuperAdmin) {
    throw new AppError("Only superAdmins can view admin list", 403);
  }

  const admins = await User.find({ role: "admin", _id: { $ne: req.user.id } }).select("_id name email isSuperAdmin privileges createdAt");

  return res.json({ admins });
});

export const updateAdminPrivileges = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { privileges } = req.body;

  // Verify requesting user is superAdmin
  if (!req.user || req.user.role !== "admin" || !req.user.isSuperAdmin) {
    throw new AppError("Only superAdmins can update admin privileges", 403);
  }

  const admin = await User.findById(adminId);
  if (!admin) {
    throw new AppError("Admin not found", 404);
  }

  if (admin.role !== "admin") {
    throw new AppError("User is not an admin", 400);
  }

  const validPrivileges = ["manage_products", "manage_orders", "manage_users", "view_analytics"];
  const selectedPrivileges = (privileges || []).filter((p) => validPrivileges.includes(p));

  admin.privileges = selectedPrivileges;
  await admin.save();

  return res.json({
    message: "Admin privileges updated",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      privileges: admin.privileges,
    },
  });
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  // Verify requesting user is superAdmin
  if (!req.user || req.user.role !== "admin" || !req.user.isSuperAdmin) {
    throw new AppError("Only superAdmins can delete other admins", 403);
  }

  // Prevent self-deletion
  if (adminId === req.user.id.toString()) {
    throw new AppError("You cannot delete yourself", 400);
  }

  const admin = await User.findById(adminId);
  if (!admin) {
    throw new AppError("Admin not found", 404);
  }

  if (admin.role !== "admin") {
    throw new AppError("User is not an admin", 400);
  }

  // Prevent deletion of other superAdmins
  if (admin.isSuperAdmin) {
    throw new AppError("Cannot delete superAdmins", 400);
  }

  await User.deleteOne({ _id: adminId });

  return res.json({ message: "Admin deleted successfully" });
});