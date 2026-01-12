import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  TrendingUp,
  Shield,
  Zap,
  ShoppingBag,
  Star,
  Clock,
} from "lucide-react";
import ThreeSpaceBackground from "../three/ThreeSpaceBackground.jsx";
import ThreeLightThemeBackground from "../three/ThreeLightThemeBackground.jsx";

export default function HeroSection() {
  const { theme } = useTheme();

  const heroBg =
    theme === "light"
      ? "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(255, 255, 255, 0.9) 0%, rgba(247, 249, 255, 0.95) 40%, rgba(238, 243, 255, 0.98) 100%)"
      : "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(26, 31, 58, 0.95) 0%, rgba(11, 15, 30, 0.98) 100%)";

  return (
    <section
      className="relative -mx-4 flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: heroBg,
      }}
    >
      {/* 3D Background */}
      {theme === "light" ? (
        <ThreeLightThemeBackground />
      ) : (
        <ThreeSpaceBackground />
      )}

      {/* Content Container */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6 backdrop-blur-sm"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 123, 95, 0.1) 0%, rgba(45, 127, 249, 0.08) 100%)"
                    : "rgba(255, 255, 255, 0.08)",
                border: `1px solid ${
                  theme === "light"
                    ? "rgba(255, 123, 95, 0.25)"
                    : "rgba(255, 123, 95, 0.4)"
                }`,
                boxShadow:
                  theme === "light"
                    ? "0 4px 25px rgba(255, 123, 95, 0.2), 0 2px 10px rgba(45, 127, 249, 0.15)"
                    : "0 4px 20px rgba(255, 123, 95, 0.1)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "#ff7b5f" }}
                ></span>
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: "#ff7b5f" }}
                ></span>
              </span>
              <span style={{ color: "#ff7b5f" }}>
                AI-Powered Shopping Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 leading-tight"
              style={{
                backgroundImage:
                  theme === "light"
                    ? "linear-gradient(135deg, #0f172a 0%, #2d7ff9 40%, #ff7b5f 80%, #e74c3c 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #a8b4d9 50%, #ff7b5f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter:
                  theme === "light"
                    ? "drop-shadow(0 2px 4px rgba(45, 127, 249, 0.1))"
                    : "none",
              }}
            >
              Shop Smarter
              <br />
              with AI Precision
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed max-w-2xl"
              style={{
                opacity: theme === "light" ? 0.75 : 0.8,
                color: theme === "light" ? "#334155" : "inherit",
                fontWeight: theme === "light" ? "500" : "normal",
              }}
            >
              Experience the future of e-commerce with real-time price tracking,
              intelligent recommendations, and unbeatable deals—all powered by
              advanced artificial intelligence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10 mx-2 sm:mx-0"
            >
              <Link to="/shop">
                <button
                  className="group relative rounded-xl px-6 sm:px-8 py-3 sm:py-4 font-bold text-white text-sm sm:text-base transition-all hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff7b5f 0%, #e74c3c 100%)",
                    boxShadow:
                      theme === "light"
                        ? "0 10px 40px rgba(255, 123, 95, 0.35), 0 4px 16px rgba(231, 76, 60, 0.2)"
                        : "0 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="relative z-10">Start Shopping</span>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity group-hover:opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, #ff7b5f 0%, #e74c3c 100%)",
                    }}
                  ></div>
                </button>
              </Link>
              <Link to="/brand-deals">
                <button
                  className="rounded-xl border-2 px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base transition-all hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={{
                    borderColor: theme === "light" ? "#2d7ff9" : "#5a9cff",
                    color: theme === "light" ? "#2d7ff9" : "#5a9cff",
                    background:
                      theme === "light"
                        ? "rgba(45, 127, 249, 0.08)"
                        : "rgba(90, 156, 255, 0.1)",
                    boxShadow:
                      theme === "light"
                        ? "0 4px 20px rgba(45, 127, 249, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)"
                        : "none",
                  }}
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  Explore Deals
                </button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm"
              style={{
                opacity: theme === "light" ? 0.9 : 0.8,
                color: theme === "light" ? "#475569" : "inherit",
              }}
            >
              <div className="flex items-center gap-2">
                <Shield
                  className="w-5 h-5"
                  style={{ color: theme === "light" ? "#10b981" : "#22c55e" }}
                />
                <span className="font-semibold">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap
                  className="w-5 h-5"
                  style={{ color: theme === "light" ? "#f59e0b" : "#fbbf24" }}
                />
                <span className="font-semibold">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp
                  className="w-5 h-5"
                  style={{ color: theme === "light" ? "#2d7ff9" : "#3b82f6" }}
                />
                <span className="font-semibold">Best Prices</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {/* Feature Card 1 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-6 backdrop-blur-xl border"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 250, 250, 0.9) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                borderColor:
                  theme === "light"
                    ? "rgba(255, 123, 95, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                boxShadow:
                  theme === "light"
                    ? "0 10px 40px rgba(255, 123, 95, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #ff7b5f 0%, #e74c3c 100%)",
                  boxShadow:
                    theme === "light"
                      ? "0 4px 16px rgba(255, 123, 95, 0.35)"
                      : "none",
                }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: theme === "light" ? "#1e293b" : "inherit" }}
              >
                Price Tracking
              </h2>
              <p
                className="text-sm"
                style={{
                  opacity: theme === "light" ? 0.65 : 0.7,
                  color: theme === "light" ? "#475569" : "inherit",
                }}
              >
                Real-time monitoring of product prices across multiple platforms
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-6 backdrop-blur-xl border mt-8"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                borderColor:
                  theme === "light"
                    ? "rgba(45, 127, 249, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                boxShadow:
                  theme === "light"
                    ? "0 10px 40px rgba(45, 127, 249, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #2d7ff9 0%, #1a5fd9 100%)",
                  boxShadow:
                    theme === "light"
                      ? "0 4px 16px rgba(45, 127, 249, 0.35)"
                      : "none",
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: theme === "light" ? "#1e293b" : "inherit" }}
              >
                AI Recommendations
              </h2>
              <p
                className="text-sm"
                style={{
                  opacity: theme === "light" ? 0.65 : 0.7,
                  color: theme === "light" ? "#475569" : "inherit",
                }}
              >
                Personalized product suggestions based on your preferences
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-6 backdrop-blur-xl border"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 245, 0.9) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                borderColor:
                  theme === "light"
                    ? "rgba(245, 158, 11, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                boxShadow:
                  theme === "light"
                    ? "0 10px 40px rgba(245, 158, 11, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)",
                  boxShadow:
                    theme === "light"
                      ? "0 4px 16px rgba(245, 158, 11, 0.35)"
                      : "none",
                }}
              >
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: theme === "light" ? "#1e293b" : "inherit" }}
              >
                Deal Alerts
              </h3>
              <p
                className="text-sm"
                style={{
                  opacity: theme === "light" ? 0.65 : 0.7,
                  color: theme === "light" ? "#475569" : "inherit",
                }}
              >
                Instant notifications when prices drop on your favorite items
              </p>
            </motion.div>

            {/* Feature Card 4 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-6 backdrop-blur-xl border mt-8"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 244, 0.9) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                borderColor:
                  theme === "light"
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                boxShadow:
                  theme === "light"
                    ? "0 10px 40px rgba(16, 185, 129, 0.15), 0 4px 16px rgba(0, 0, 0, 0.05)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
                  boxShadow:
                    theme === "light"
                      ? "0 4px 16px rgba(16, 185, 129, 0.35)"
                      : "none",
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: theme === "light" ? "#1e293b" : "inherit" }}
              >
                Secure Payment
              </h3>
              <p
                className="text-sm"
                style={{
                  opacity: theme === "light" ? 0.65 : 0.7,
                  color: theme === "light" ? "#475569" : "inherit",
                }}
              >
                Bank-grade encryption for all your transactions
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden sm:block absolute bottom-2 lg:bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1,
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{
              opacity: theme === "light" ? 0.7 : 0.6,
              color: theme === "light" ? "#475569" : "inherit",
            }}
          >
            Scroll to explore
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              opacity: theme === "light" ? 0.7 : 0.6,
              color: theme === "light" ? "#64748b" : "inherit",
            }}
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
