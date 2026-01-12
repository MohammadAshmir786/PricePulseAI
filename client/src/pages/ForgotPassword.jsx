import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import PageMeta from "../components/PageMeta.jsx";
import {
  requestPasswordReset,
  verifyPasswordOTP,
  resetPassword,
} from "../services/authService.js";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [status, setStatus] = useState("idle");
  const { theme } = useTheme();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast("Enter your email", "info");
    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email);
      toast("OTP sent to your email", "success");
      if (res.devOtp) setDevOtp(res.devOtp);
      setStep(2);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndReset = async (e) => {
    e.preventDefault();
    if (!otp || !password) return toast("Enter OTP and new password", "info");
    setIsLoading(true);
    try {
      await verifyPasswordOTP({ email, otp });
      await resetPassword({ email, otp, password });
      setStatus("success");
      toast("Password reset successful. Please sign in.", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setStatus("error");
      toast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Reset Password - PricePulseAI"
        description="Reset your PricePulseAI account password using the OTP sent to your email. Secure your account and regain access quickly."
      />
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{
          background:
            theme === "light"
              ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
              : "linear-gradient(135deg, #0b0f1e 0%, #1a1f3a 100%)",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <div
            className="rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl border"
            style={{
              background:
                theme === "light"
                  ? "rgba(255, 255, 255, 0.85)"
                  : "rgba(255, 255, 255, 0.05)",
              borderColor:
                theme === "light"
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(255, 255, 255, 0.1)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="mb-4">
                <div
                  className="inline-flex items-center justify-center h-12 w-12 rounded-xl mx-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  }}
                >
                  <KeyRound className="h-6 w-6" color="#fff" />
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">
                Reset Password
              </h1>
              <p className="opacity-70 text-sm">
                Use the OTP sent to your email to reset your password
              </p>
            </motion.div>

            {step === 1 ? (
              <form className="space-y-4" onSubmit={sendOtp}>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full ps-12 pe-12 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm md:text-base"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.05)"
                          : "rgba(255, 255, 255, 0.08)",
                      border:
                        theme === "light"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      color: "var(--text)",
                      "--tw-ring-color": "var(--accent)",
                    }}
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:scale-100 disabled:opacity-70 mt-4"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  }}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
                {devOtp && (
                  <p className="text-xs opacity-60 mt-2">Dev OTP: {devOtp}</p>
                )}
                <p className="text-xs opacity-70 mt-4">
                  Remembered your password?{" "}
                  <Link
                    to="/login"
                    style={{ color: "var(--accent)" }}
                    className="font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={verifyAndReset}>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl text-sm md:text-base opacity-70"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 255, 255, 0.08)",
                    border:
                      theme === "light"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
                <label className="block text-sm font-semibold mb-2">
                  OTP Code
                </label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-3.5 h-5 w-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    required
                    type="text"
                    name="otp"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full ps-12 pe-12 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm md:text-base"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.05)"
                          : "rgba(255, 255, 255, 0.08)",
                      border:
                        theme === "light"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      color: "var(--text)",
                      "--tw-ring-color": "var(--accent)",
                    }}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>
                <label className="block text-sm font-semibold mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    required
                    type={showNewPassword ? "text" : "password"}
                    name="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full ps-12 pe-12 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm md:text-base"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.05)"
                          : "rgba(255, 255, 255, 0.08)",
                      border:
                        theme === "light"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      color: "var(--text)",
                      "--tw-ring-color": "var(--accent)",
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-4 top-3.5 opacity-50 hover:opacity-100 transition-opacity"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:scale-100 disabled:opacity-70 mt-4"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  }}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
                <p className="text-xs opacity-70 mt-4">
                  Didn't receive the OTP?{" "}
                  <button
                    type="button"
                    onClick={(e) => sendOtp(e)}
                    className="font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    Resend
                  </button>
                </p>
              </form>
            )}
            {/* Status Messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: "rgba(76, 175, 80, 0.15)",
                  borderColor: "rgba(76, 175, 80, 0.3)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">
                  Password reset successful! Redirecting...
                </span>
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: "rgba(244, 67, 54, 0.15)",
                  borderColor: "rgba(244, 67, 54, 0.3)",
                }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium">
                  Password reset failed. Please try again.
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
