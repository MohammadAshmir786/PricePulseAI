import { motion } from "framer-motion";
import CountUp from "../CountUp.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { Lightbulb, Target, Users, Zap } from "lucide-react";

export default function AboutSection() {
  const { theme } = useTheme();

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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stats = [
    { label: "Products Tracked", value: 10000, suffix: "K+", icon: Target },
    { label: "Happy Shoppers", value: 50000, suffix: "K+", icon: Users },
    { label: "Satisfaction Rate", value: 99, suffix: "%", icon: Zap },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly evolving our AI to deliver better results",
    },
    {
      icon: Target,
      title: "Accuracy",
      description: "Precise price tracking across all major retailers",
    },
    {
      icon: Users,
      title: "Community",
      description: "Built by shoppers, for shoppers worldwide",
    },
    {
      icon: Zap,
      title: "Speed",
      description: "Lightning-fast comparisons and instant notifications",
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background:
              theme === "light"
                ? "rgba(155, 89, 182, 0.3)"
                : "rgba(155, 89, 182, 0.2)",
          }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background:
              theme === "light"
                ? "rgba(52, 152, 219, 0.3)"
                : "rgba(52, 152, 219, 0.2)",
          }}
        ></div>
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-20"
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
              About Us
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Your AI Shopping
              <br />
              <span
                className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                }}
              >
                Companion
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-lg opacity-70 leading-relaxed">
              We're on a mission to revolutionize shopping by combining
              artificial intelligence with human insight. Our platform helps
              millions of users save money and make smarter purchasing decisions
              every day.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="grid gap-8 md:grid-cols-3"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative rounded-2xl p-8 text-center transition-all hover:scale-105"
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
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-3 rounded-xl text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-4xl lg:text-5xl font-black mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-lg opacity-70">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Values Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Our Core Values</h3>
              <p className="opacity-70 max-w-2xl mx-auto">
                These principles guide every decision we make and feature we
                build.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="group rounded-xl p-6 transition-all hover:scale-105"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(255, 255, 255, 0.02)",
                      border:
                        theme === "light"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      className="mb-4 inline-flex p-2 rounded-lg"
                      style={{
                        background:
                          theme === "light"
                            ? "rgba(155, 89, 182, 0.15)"
                            : "rgba(155, 89, 182, 0.2)",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{
                          color:
                            theme === "light"
                              ? "var(--primary)"
                              : "var(--accent)",
                        }}
                      />
                    </div>
                    <h4 className="font-bold mb-2">{value.title}</h4>
                    <p className="text-sm opacity-70">{value.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl p-12 text-center overflow-hidden"
            style={{
              background:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.08)"
                  : "rgba(155, 89, 182, 0.05)",
              border:
                theme === "light"
                  ? "1px solid rgba(155, 89, 182, 0.2)"
                  : "1px solid rgba(155, 89, 182, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Our Mission
            </h3>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed opacity-80">
              To empower every shopper with intelligent, real-time insights that
              help them discover better deals, save money, and make confident
              purchasing decisions. We believe everyone deserves access to
              advanced technology that puts them in control of their shopping
              experience.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
