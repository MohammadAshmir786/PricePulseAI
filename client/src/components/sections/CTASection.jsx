import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function CTASection() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background:
              theme === "light"
                ? "rgba(155, 89, 182, 0.3)"
                : "rgba(155, 89, 182, 0.2)",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background:
              theme === "light"
                ? "rgba(230, 126, 34, 0.3)"
                : "rgba(230, 126, 34, 0.2)",
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <motion.div
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
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{
                    background:
                      theme === "light" ? "var(--primary)" : "var(--accent)",
                  }}
                ></span>
                Join Our Community
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                <span
                  className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  }}
                >
                  Smart Shopping
                </span>
                <br />
                Starts Here
              </h2>
            </div>

            <p className="text-lg leading-relaxed opacity-80">
              Experience AI-powered recommendations, real-time price tracking,
              and personalized deals. Join thousands of smart shoppers saving
              money every day.
            </p>

            {/* Features List */}
            <div className="space-y-4 pt-4">
              {[
                "Real-time price alerts on your wishlist",
                "AI-powered product recommendations",
                "One-click price comparison",
                "Exclusive member deals & discounts",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <div
                    className="mt-1 h-5 w-5 rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.2)"
                          : "rgba(155, 89, 182, 0.3)",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-purple-400"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm md:text-base opacity-90">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <button
                  className="w-full group relative rounded-xl px-6 sm:px-8 py-3 sm:py-4 font-bold text-white shadow-lg transition-all hover:scale-105 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    }}
                  ></div>
                </button>
              </Link>
              <Link to="/shop" className="w-full sm:w-auto">
                <button
                  className="rounded-xl border-2 px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base transition-all hover:scale-105 backdrop-blur-sm w-full sm:w-auto"
                  style={{
                    borderColor: theme === "light" ? "#0b4abf" : "#9cc4ff",
                    color: theme === "light" ? "#0b4abf" : "#d8e6ff",
                    background:
                      theme === "light"
                        ? "rgba(11, 74, 191, 0.08)"
                        : "rgba(90, 156, 255, 0.12)",
                    boxShadow:
                      theme === "light"
                        ? "0 4px 20px rgba(11, 74, 191, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)"
                        : "none",
                  }}
                >
                  Browse Products
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual Element */}
          <motion.div
            variants={itemVariants}
            className="relative h-120 md:h-full min-h-96 rounded-2xl overflow-hidden"
            style={{
              background:
                theme === "light"
                  ? "linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(230, 126, 34, 0.1))"
                  : "linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(230, 126, 34, 0.1))",
              border:
                theme === "light"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Animated Cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="space-y-4 w-4/5"
              >
                {[
                  { title: "iPhone 14 Pro", price: "$899", discount: "-15%" },
                  { title: "Sony WH-1000", price: "$349", discount: "-22%" },
                  { title: "iPad Air", price: "$599", discount: "-10%" },
                  { title: "MacBook Pro", price: "$1299", discount: "-12%" },
                  { title: "Dell XPS 13", price: "$999", discount: "-18%" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg backdrop-blur-sm flex justify-between items-center"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.8)"
                          : "rgba(255, 255, 255, 0.05)",
                      border:
                        theme === "light"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p
                        className="text-xs opacity-60"
                        style={{
                          color:
                            theme === "light"
                              ? "var(--primary)"
                              : "var(--muted)",
                        }}
                      >
                        {item.price}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(233, 30, 99, 0.2)",
                        color: "#e91e63",
                      }}
                    >
                      {item.discount}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 md:gap-8 mt-16 pt-16 border-t"
          style={{
            borderColor:
              theme === "light"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(255, 255, 255, 0.1)",
          }}
        >
          {[
            { number: "50K+", label: "Active Users" },
            { number: "$2M+", label: "Money Saved" },
            { number: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p
                className="text-3xl md:text-4xl font-black"
                style={{
                  color: theme === "light" ? "#7c0f44" : "#ff7fc8",
                }}
              >
                {stat.number}
              </p>
              <p className="text-sm md:text-base opacity-60 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
