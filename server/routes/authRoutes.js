import express from "express";
import rateLimit from "express-rate-limit";
import { auth } from "../middleware/auth.js";
import passport from "../config/passport.js";
import { login, me, register, refresh, logout, forgotPassword, verifyResetOtp, resetPassword, oauthSuccess, updateProfile, deleteProfile, createAdmin, listAdmins, updateAdminPrivileges, deleteAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
// login attempts limited to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});
router.post("/login", loginLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", auth(), me);
router.put("/profile", auth(), updateProfile);
router.delete("/profile", auth(), deleteProfile);
// Password reset via email OTP
const otpLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // limit each IP to 5 OTP requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many OTP requests. Try again after 24 hours." },
});
router.post("/password/forgot", otpLimiter, forgotPassword);
router.post("/password/verify", verifyResetOtp);
router.post("/password/reset", resetPassword);

// Admin management endpoints
router.post("/admin", auth(), createAdmin);
router.get("/admin", auth(), listAdmins);
router.put("/admin/:adminId", auth(), updateAdminPrivileges);
router.delete("/admin/:adminId", auth(), deleteAdmin);

// OAuth: Google
router.get("/google", (req, res, next) => {
  const nextParam = req.query?.next || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: nextParam,
  })(req, res, next);
});
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      const origins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
      const origin = origins?.[0] || "http://localhost:5173";
      return res.redirect(`${origin}/login?error=google`);
    }
    req.user = user;
    return oauthSuccess(req, res, next);
  })(req, res, next);
});

// OAuth: GitHub
router.get("/github", (req, res, next) => {
  const nextParam = req.query?.next || "/";
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
    state: nextParam,
  })(req, res, next);
});
router.get("/github/callback", (req, res, next) => {
  passport.authenticate("github", { session: false }, (err, user) => {
    if (err || !user) {
      const origins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
      const origin = origins?.[0] || "http://localhost:5173";
      return res.redirect(`${origin}/login?error=github`);
    }
    req.user = user;
    return oauthSuccess(req, res, next);
  })(req, res, next);
});

export default router;
