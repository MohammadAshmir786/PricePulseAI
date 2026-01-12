import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  Zap,
  Search,
  Sparkles,
  TrendingDown,
  Clock,
  Shield,
} from "lucide-react";

export default function FeaturesSection() {
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Real-time price tracking updates instantly across all major retailers.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Find exactly what you need with AI-powered intelligent search.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sparkles,
      title: "Personalized AI",
      description:
        "Get tailored product suggestions based on your preferences.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingDown,
      title: "Price Alerts",
      description:
        "Get notified instantly when prices drop on your wishlist items.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Clock,
      title: "Historical Data",
      description: "View price history and trends to make informed purchases.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is encrypted and never shared with third parties.",
      gradient: "from-rose-500 to-red-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
    <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{
            background:
              theme === "light"
                ? "rgba(155, 89, 182, 0.4)"
                : "rgba(155, 89, 182, 0.2)",
          }}
        ></div>
        <div
          className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{
            background:
              theme === "light"
                ? "rgba(52, 152, 219, 0.4)"
                : "rgba(52, 152, 219, 0.2)",
          }}
        ></div>
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background:
                  theme === "light"
                    ? "rgba(155, 89, 182, 0.1)"
                    : "rgba(155, 89, 182, 0.15)",
                border:
                  theme === "light"
                    ? "1px solid rgba(155, 89, 182, 0.3)"
                    : "1px solid rgba(155, 89, 182, 0.4)",
                color: theme === "light" ? "var(--primary)" : "var(--accent)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background:
                    theme === "light" ? "var(--primary)" : "var(--accent)",
                }}
              ></span>
              Powerful Features
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Everything You Need
            </h2>

            <p className="mx-auto max-w-2xl text-lg opacity-70 leading-relaxed">
              Discover all the tools that make PricePulse AI the ultimate
              shopping companion for savvy consumers.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative rounded-2xl p-8 transition-all duration-300 overflow-hidden h-full"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(255, 255, 255, 0.6)"
                        : "rgba(255, 255, 255, 0.02)",
                    border:
                      theme === "light"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Animated Background Gradient */}
                  <div
                    className={`absolute -inset-full bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Icon Container */}
                    <div
                      className={`inline-flex rounded-xl p-3 text-white bg-linear-to-r ${feature.gradient}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold tracking-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="opacity-70 leading-relaxed text-sm">
                      {feature.description}
                    </p>

                    {/* Learn More Link */}
                    <div className="pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-semibold text-transparent bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text">
                        Learn more
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-transparent bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text group-hover:translate-x-1 transition-transform"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* Border Animation */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, rgba(155, 89, 182, 0.5), transparent)`,
                    }}
                  ></div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <p className="opacity-70 mb-6">
              Ready to experience smarter shopping?
            </p>
            <Link to={user ? "/shop" : "/register"} className="inline-flex gap-4">
              <button
                className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  color: "white",
                }}
              >
                Start Free Trial
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
