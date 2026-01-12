import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext.jsx";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart, Home, User, Menu, Heart } from "lucide-react";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.items.length);
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");
  const [hideNavOnScroll, setHideNavOnScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHideNavOnScroll(true);
      } else {
        setHideNavOnScroll(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setNavQuery(params.get("q") || "");
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = navQuery.trim();
    if (!term) return;
    navigate(`/shop?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setOpen(false);
  };

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    const isLight = theme === "light";

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    let particles = [];
    const darkBase = { r: 155, g: 89, b: 182 };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.3 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(${darkBase.r}, ${darkBase.g}, ${darkBase.b}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let blobs = [];
    const lightBlobColors = [
      "rgba(155, 89, 182, 0.08)",
      "rgba(233, 30, 99, 0.06)",
      "rgba(156, 39, 176, 0.07)",
    ];

    class Blob {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 60 + 40;
        this.size = this.baseSize;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.002 + Math.random() * 0.003;
        this.color =
          lightBlobColors[Math.floor(Math.random() * lightBlobColors.length)];
        this.dx = Math.random() * 0.15 - 0.075;
        this.dy = Math.random() * 0.15 - 0.075;
      }

      update() {
        this.phase += this.speed;
        this.size =
          this.baseSize + Math.sin(this.phase) * (this.baseSize * 0.15);
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }

      draw() {
        const grad = ctx.createRadialGradient(
          this.x,
          this.y,
          this.size * 0.1,
          this.x,
          this.y,
          this.size
        );
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      if (isLight) {
        blobs = [];
        for (let i = 0; i < 8; i++) blobs.push(new Blob());
      } else {
        particles = [];
        for (let i = 0; i < 30; i++) particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isLight) {
        blobs.forEach((b) => {
          b.update();
          b.draw();
        });
      } else {
        particles.forEach((particle, i) => {
          particle.update();
          particle.draw();
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 80) {
              ctx.strokeStyle = `rgba(${darkBase.r}, ${darkBase.g}, ${
                darkBase.b
              }, ${0.1 * (1 - distance / 80)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();
    window.addEventListener("resize", () => {
      resize();
      init();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: hideNavOnScroll ? -100 : 0,
        opacity: hideNavOnScroll ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
      style={{
        backgroundColor:
          theme === "light"
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(15, 20, 40, 0.85)",
        borderColor:
          theme === "light"
            ? "rgba(155, 89, 182, 0.15)"
            : "rgba(155, 89, 182, 0.25)",
        boxShadow:
          theme === "light"
            ? "0 2px 20px rgba(155, 89, 182, 0.08)"
            : "0 2px 20px rgba(155, 89, 182, 0.15), 0 0 40px rgba(155, 89, 182, 0.08)",
      }}
    >
      {/* Background Animation */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "60px",
          pointerEvents: "none",
          zIndex: 0,
          opacity: theme === "light" ? 0.8 : 0.6,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-15 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="shrink-0"
        >
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PricePulse
          </Link>
        </motion.div>

        {/* Center Search - Desktop Only */}
        <div className="hidden lg:flex flex-1 justify-center mx-6">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-form"
                  onSubmit={handleSearchSubmit}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    autoFocus
                    value={navQuery}
                    onChange={(e) => setNavQuery(e.target.value)}
                    className="w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm backdrop-blur transition-all focus:outline-none focus:ring-2"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.08)",
                      borderColor:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.25)"
                          : "rgba(155, 89, 182, 0.4)",
                      color: theme === "light" ? "#000" : "#fff",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  key="search-btn"
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 group relative transition-all"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.06)"
                        : "rgba(155, 89, 182, 0.1)",
                    borderColor:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.15)"
                        : "rgba(155, 89, 182, 0.2)",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(155, 89, 182, 0.2) 0%, transparent 70%)",
                      filter: "blur(6px)",
                    }}
                  />
                  <Search className="w-4 h-4 relative z-10" />
                  <span className="text-sm text-gray-500 relative z-10">
                    Search...
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Actions */}
        <motion.div
          className="hidden sm:flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Home Button */}
          {!isHomePage && (
            <Link
              to="/"
              aria-label="Go to home"
              className="p-2 rounded-lg border transition-all group relative"
              style={{
                borderColor:
                  theme === "light"
                    ? "rgba(155, 89, 182, 0.15)"
                    : "rgba(155, 89, 182, 0.2)",
                background:
                  theme === "light"
                    ? "rgba(155, 89, 182, 0.05)"
                    : "rgba(155, 89, 182, 0.08)",
              }}
            >
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(155, 89, 182, 0.2) 0%, transparent 70%)",
                  filter: "blur(4px)",
                }}
              />
              <Home className="w-5 h-5 relative z-10" />
            </Link>
          )}

          {/* Cart Button */}
          <Link
            to="/cart"
            aria-label="View cart"
            className="relative p-2 rounded-lg border transition-all group"
            style={{
              borderColor:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.15)"
                  : "rgba(155, 89, 182, 0.2)",
              background:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.05)"
                  : "rgba(155, 89, 182, 0.08)",
            }}
          >
            <span
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(155, 89, 182, 0.2) 0%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
            <ShoppingCart className="w-5 h-5 relative z-10" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            aria-label="View wishlist"
            className="relative p-2 rounded-lg border transition-all group"
            style={{
              borderColor:
                theme === "light"
                  ? "rgba(255, 45, 85, 0.15)"
                  : "rgba(255, 45, 85, 0.2)",
              background:
                theme === "light"
                  ? "rgba(255, 45, 85, 0.05)"
                  : "rgba(255, 45, 85, 0.08)",
            }}
          >
            <span
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255, 45, 85, 0.2) 0%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
            <Heart className="w-5 h-5 text-red-500 relative z-10" />
          </Link>

          {/* Theme Toggle */}
          <motion.label
            className="theme-switch ml-1 cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            <input
              type="checkbox"
              name="theme-toggle"
              checked={theme === "light"}
              onChange={toggleTheme}
              aria-label="Toggle light or dark theme"
            />
            <span className="slider" />
            <span className="decoration" />
          </motion.label>

          {/* Divider */}
          <div
            className="w-px h-6"
            style={{
              background:
                theme === "light"
                  ? "rgba(0, 0, 0, 0.08)"
                  : "rgba(255, 255, 255, 0.08)",
            }}
          />

          {/* Auth Buttons */}
          {!user && (
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all group relative"
              style={{
                borderColor:
                  theme === "light"
                    ? "rgba(155, 89, 182, 0.2)"
                    : "rgba(155, 89, 182, 0.3)",
                color: theme === "light" ? "var(--primary)" : "var(--accent)",
                background:
                  theme === "light"
                    ? "rgba(155, 89, 182, 0.05)"
                    : "rgba(155, 89, 182, 0.08)",
              }}
            >
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)",
                  filter: "blur(6px)",
                }}
              />
              <span className="relative z-10">Sign up</span>
            </Link>
          )}

          <Link
            to={user ? "/profile" : "/login"}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative overflow-hidden"
            style={
              user
                ? {
                    borderColor:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.15)"
                        : "rgba(155, 89, 182, 0.2)",
                    color:
                      theme === "light" ? "var(--primary)" : "var(--accent)",
                    background:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.05)"
                        : "rgba(155, 255, 255, 0.08)",
                    border:
                      theme === "light"
                        ? "1px solid rgba(155, 89, 182, 0.15)"
                        : "1px solid rgba(155, 89, 182, 0.2)",
                  }
                : {
                    color: "white",
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    boxShadow:
                      "0 4px 12px rgba(155, 89, 182, 0.3), 0 0 20px rgba(155, 89, 182, 0.2)",
                    border: "none",
                  }
            }
          >
            {user && <User className="w-4 h-4" />}
            <span className="text-sm">
              {user ? user.name.split(" ")[0] : "Sign in"}
            </span>
          </Link>
        </motion.div>

        {/* Mobile Buttons */}
        <div className="sm:hidden flex items-center gap-2">
          {/* Home Button */}
          {!isHomePage && (
            <Link
              to="/"
              aria-label="Go to home"
              className="p-2 rounded-lg border transition-all group relative"
              style={{
                borderColor:
                  theme === "light"
                    ? "rgba(155, 89, 182, 0.15)"
                    : "rgba(155, 89, 182, 0.2)",
                background:
                  theme === "light"
                    ? "rgba(155, 89, 182, 0.05)"
                    : "rgba(155, 89, 182, 0.08)",
              }}
            >
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(155, 89, 182, 0.2) 0%, transparent 70%)",
                  filter: "blur(4px)",
                }}
              />
              <Home className="w-5 h-5 relative z-10" />
            </Link>
          )}
          {/* Mobile Menu Button */}
          <motion.button
            className="p-2 rounded-lg border transition-all relative"
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              borderColor:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.15)"
                  : "rgba(155, 89, 182, 0.2)",
              background:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.05)"
                  : "rgba(155, 89, 182, 0.08)",
            }}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t relative z-10 overflow-hidden"
            style={{
              borderColor:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.1)"
                  : "rgba(155, 89, 182, 0.15)",
            }}
          >
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <input
                  type="search"
                  placeholder="Search..."
                  value={navQuery}
                  onChange={(e) => setNavQuery(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.03)"
                        : "rgba(255, 255, 255, 0.05)",
                    borderColor:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.2)"
                        : "rgba(155, 89, 182, 0.3)",
                  }}
                />
              </form>

              {/* Mobile Action Buttons */}
              <div
                className="h-px my-2"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.08)"
                      : "rgba(255, 255, 255, 0.08)",
                }}
              />

              <div className="flex gap-2 mb-2">
                {/* Cart Button */}
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  aria-label="View cart"
                  className="relative flex-1 p-2.5 rounded-lg border transition-all flex items-center justify-center gap-2"
                  style={{
                    borderColor:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.15)"
                        : "rgba(155, 89, 182, 0.2)",
                    background:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.05)"
                        : "rgba(155, 89, 182, 0.08)",
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span
                      className="flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Wishlist Button */}
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  aria-label="View wishlist"
                  className="relative flex-1 p-2.5 rounded-lg border transition-all flex items-center justify-center"
                  style={{
                    borderColor:
                      theme === "light"
                        ? "rgba(255, 45, 85, 0.15)"
                        : "rgba(255, 45, 85, 0.2)",
                    background:
                      theme === "light"
                        ? "rgba(255, 45, 85, 0.05)"
                        : "rgba(255, 45, 85, 0.08)",
                  }}
                >
                  <Heart className="w-4 h-4 text-red-500" />
                </Link>

                {/* Theme Toggle */}
                <label
                  className="theme-switch cursor-pointer p-2.5 rounded-lg border transition-all flex items-center justify-center"
                  style={{
                    borderColor:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.15)"
                        : "rgba(155, 89, 182, 0.2)",
                    background:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.05)"
                        : "rgba(155, 89, 182, 0.08)",
                  }}
                >
                  <input
                    type="checkbox"
                    name="theme-toggle-mobile"
                    checked={theme === "light"}
                    onChange={toggleTheme}
                    aria-label="Toggle Theme"
                  />
                  <span className="slider" />
                  <span className="decoration" />
                </label>
              </div>

              <div
                className="h-px my-2"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.08)"
                      : "rgba(255, 255, 255, 0.08)",
                }}
              />

              {!user && (
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-medium border text-center"
                  style={{
                    borderColor:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.2)"
                        : "rgba(155, 89, 182, 0.3)",
                    color:
                      theme === "light" ? "var(--primary)" : "var(--accent)",
                    background:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.05)"
                        : "rgba(155, 89, 182, 0.08)",
                  }}
                >
                  Sign up
                </Link>
              )}

              <Link
                to={user ? "/profile" : "/login"}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-center"
                style={
                  user
                    ? {
                        color:
                          theme === "light"
                            ? "var(--primary)"
                            : "var(--accent)",
                        background:
                          theme === "light"
                            ? "rgba(155, 89, 182, 0.05)"
                            : "rgba(155, 89, 182, 0.08)",
                        border:
                          theme === "light"
                            ? "1px solid rgba(155, 89, 182, 0.15)"
                            : "1px solid rgba(155, 89, 182, 0.2)",
                      }
                    : {
                        color: "white",
                        background:
                          "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                        border: "none",
                      }
                }
              >
                {user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
