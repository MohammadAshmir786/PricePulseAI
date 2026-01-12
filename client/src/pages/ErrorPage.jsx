import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import PageMeta from "../components/PageMeta.jsx";
import { AlertTriangle, Home, RefreshCw, Code } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
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

  return (
    <>
      <PageMeta
        title="Error - PricePulseAI"
        description="An error occurred on PricePulseAI. Find out more about the issue and how to proceed."
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
            {/* Icon */}
            <motion.div variants={itemVariants} className="inline-flex mb-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(231, 76, 60, 0.15)",
                }}
              >
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-black mb-4"
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Error Message */}
            <motion.p
              variants={itemVariants}
              className="text-lg opacity-70 mb-8"
            >
              {error?.statusText ||
                error?.message ||
                "An unexpected error occurred"}
            </motion.p>

            {/* Error Stack (Development) */}
            {error?.stack && process.env.NODE_ENV === "development" && (
              <motion.div
                variants={itemVariants}
                className="mb-8 rounded-xl p-4 text-left border overflow-auto max-h-64"
                style={{
                  background: "rgba(231, 76, 60, 0.1)",
                  borderColor: "rgba(231, 76, 60, 0.3)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-semibold text-red-400">
                    Stack Trace
                  </span>
                </div>
                <pre className="text-xs opacity-70 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </motion.div>
            )}

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
              <button
                onClick={() => window.location.reload()}
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
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
