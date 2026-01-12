import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import PageMeta from "../components/PageMeta.jsx";
import { Home, ShoppingBag, Search, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <PageMeta
        title="404 Not Found - PricePulseAI"
        description="The page you are looking for cannot be found. Explore PricePulseAI to find what you need."
      />
      <section className="min-h-screen flex items-center justify-center px-4 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-8 md:p-12 backdrop-blur-xl border text-center"
            style={{
              background:
                theme === "light"
                  ? "rgba(255, 255, 255, 0.6)"
                  : "rgba(255, 255, 255, 0.02)",
              borderColor:
                theme === "light"
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* 404 Number with Icon */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="mb-6"
            >
              <div className="relative inline-block">
                <h1
                  className="text-8xl md:text-9xl font-black mb-0"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  404
                </h1>
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(241, 196, 15, 0.15)",
                    }}
                  >
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Page Not Found
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg opacity-70 mb-8 max-w-md mx-auto"
            >
              The page you're looking for doesn't exist or has been moved. Let's
              get you back on track!
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={itemVariants}
              className="flex gap-3 justify-center flex-wrap"
            >
              <Link to="/">
                <button
                  className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  }}
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </button>
              </Link>
              <Link to="/shop">
                <button
                  className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2 border"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(255, 255, 255, 0.8)"
                        : "rgba(255, 255, 255, 0.05)",
                    borderColor:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Browse Shop
                </button>
              </Link>
            </motion.div>

            {/* Suggestion */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-8 border-t"
              style={{
                borderColor:
                  theme === "light"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <p className="text-sm opacity-70 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Try searching for what you need or check your cart
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
