import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";

export default function LoadingScreen() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background:
          theme === "light"
            ? "radial-gradient(1200px 600px at 20% 20%, #ffffff 0%, #f7f9ff 45%, #eef3ff 100%)"
            : "linear-gradient(135deg, #1a1f3a 0%, #0b0f1e 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* Background accent overlays */}
      <div
        style={{
          position: "absolute",
          left: "-100px",
          top: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            theme === "light"
              ? "radial-gradient(closest-side, rgba(255,123,95,0.15), rgba(255,123,95,0))"
              : "radial-gradient(closest-side, rgba(255,123,95,0.15), rgba(255,123,95,0))",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-100px",
          bottom: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            theme === "light"
              ? "radial-gradient(closest-side, rgba(45,127,249,0.15), rgba(45,127,249,0))"
              : "radial-gradient(closest-side, rgba(45,127,249,0.15), rgba(45,127,249,0))",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Animated Logo/Icon Container */}
        <motion.div
          style={{
            position: "relative",
            width: "120px",
            height: "120px",
            margin: "0 auto 2rem",
          }}
        >
          {/* Outer rotating orbit */}
          <motion.div
            variants={orbitVariants}
            animate="animate"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              border: `2px solid ${
                theme === "light"
                  ? "rgba(255, 123, 95, 0.2)"
                  : "rgba(255, 123, 95, 0.3)"
              }`,
              borderRadius: "50%",
              top: 0,
              left: 0,
            }}
          />

          {/* Inner rotating orbit */}
          <motion.div
            variants={orbitVariants}
            animate={{
              rotate: -360,
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{
              position: "absolute",
              width: "80%",
              height: "80%",
              border: `2px solid ${
                theme === "light"
                  ? "rgba(45, 127, 249, 0.2)"
                  : "rgba(45, 127, 249, 0.3)"
              }`,
              borderRadius: "50%",
              top: "10%",
              left: "10%",
            }}
          />

          {/* Center pulsing circle */}
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background:
                theme === "light"
                  ? "linear-gradient(135deg, #ff7b5f 0%, #2d7ff9 100%)"
                  : "linear-gradient(135deg, #ff7b5f 0%, #2d7ff9 100%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 40px ${
                theme === "light"
                  ? "rgba(255, 123, 95, 0.4)"
                  : "rgba(255, 123, 95, 0.5)"
              }`,
            }}
          />
        </motion.div>

        {/* Text content */}
        <motion.div variants={itemVariants}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "0.5rem",
              background:
                theme === "light"
                  ? "linear-gradient(135deg, #ff7b5f 0%, #2d7ff9 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #a8b4d9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PricePulseAI
          </h2>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontWeight: "500",
            }}
          >
            Loading your experience...
          </p>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: theme === "light" ? "#ff7b5f" : "#ff7b5f",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
