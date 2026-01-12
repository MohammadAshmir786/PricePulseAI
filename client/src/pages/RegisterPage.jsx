import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slices/authSlice.js";
import { Navigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import PageMeta from "../components/PageMeta.jsx";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import ThreeObjectsWithParticlesBackground from "../components/three/ThreeObjectsWithParticlesBackground.jsx";


export default function RegisterPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/shop";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { error, status } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast("Please agree to the terms and conditions", "info");
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(register(form)).unwrap();
      toast("Account created successfully", "success");
    } catch (err) {
      const message = err?.message || "Registration failed";
      toast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "failed" && error) {
      toast(error, "error");
    }
  }, [status, error, toast]);

  if (user) return <Navigate to="/" replace />;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <PageMeta
        title="Register - PricePulseAI"
        description="Create a PricePulseAI account to start saving on every purchase with personalized deals and offers."
      />
      <ThreeObjectsWithParticlesBackground />
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{
          background:
            theme === "light"
              ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
              : "linear-gradient(135deg, #0b0f1e 0%, #1a1f3a 100%)",
        }}
      >
        {/* Background Blurs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div
            className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{
              background:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.3)"
                  : "rgba(155, 89, 182, 0.2)",
            }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{
              background:
                theme === "light"
                  ? "rgba(52, 152, 219, 0.3)"
                  : "rgba(52, 152, 219, 0.2)",
            }}
          ></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md my-12"
        >
          {/* Card */}
          <div
            className="rounded-3xl py-6 px-8 backdrop-blur-xl shadow-2xl border"
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
            {/* Header */}
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
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <path d="M20 8v6"></path>
                    <path d="M23 11h-6"></path>
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">
                Join PricePulse
              </h1>
              <p className="opacity-70 text-sm">
                Create your account and start saving on every purchase
              </p>
            </motion.div>

            {/* Form */}
            <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
              {/* Error Banner */}
              {error && (
                <div
                  className="mb-4 p-3 rounded-lg text-sm"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(255,0,0,0.08)"
                        : "rgba(255,0,0,0.12)",
                    border: "1px solid rgba(255,0,0,0.3)",
                    color: theme === "light" ? "#b00020" : "#ff6b6b",
                  }}
                  role="alert"
                >
                  {error}
                </div>
              )}
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 h-5 w-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    required
                    type="text"
                    name="name"
                    id="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm md:text-base"
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
                    autoComplete="name"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm md:text-base"
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
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full pl-12 pr-12 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm md:text-base"
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs opacity-60 mt-2">
                  At least 8 characters with uppercase, lowercase, and numbers
                </p>
              </motion.div>

              {/* Terms Checkbox */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label
                  htmlFor="terms"
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    name="terms"
                    id="terms"
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded cursor-pointer"
                    style={{
                      accentColor: "var(--accent)",
                    }}
                  />
                  <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity leading-relaxed">
                    I agree to the{" "}
                    <Link
                      to="#"
                      className="font-semibold underline"
                      style={{ color: "var(--accent)" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      className="font-semibold underline"
                      style={{ color: "var(--accent)" }}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:scale-100 disabled:opacity-70 mt-6 group relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
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
                    </>
                  )}
                </span>
                <div
                  className="absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity group-hover:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                  }}
                ></div>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex-1 h-px rounded-full"
                  style={{
                    background:
                      theme === "light"
                        ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(155,89,182,0.5) 50%, rgba(0,0,0,0) 100%)"
                        : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(155,89,182,0.6) 50%, rgba(255,255,255,0) 100%)",
                  }}
                ></span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(155, 89, 182, 0.4)",
                    color: "var(--accent)",
                    letterSpacing: "0.08em",
                  }}
                >
                  or sign up with
                </span>
                <span
                  className="flex-1 h-px rounded-full"
                  style={{
                    background:
                      theme === "light"
                        ? "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(155,89,182,0.5) 50%, rgba(0,0,0,0) 100%)"
                        : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(155,89,182,0.6) 50%, rgba(255,255,255,0) 100%)",
                  }}
                ></span>
              </div>
            </div>

            {/* Social Login */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              <button
                type="button"
                onClick={() => {
                  const next = encodeURIComponent(from);
                  window.location.href = `/api/auth/github?next=${next}`;
                }}
                className="py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105 border flex items-center justify-center gap-2"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.05)"
                      : "rgba(255, 255, 255, 0.05)",
                  borderColor:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.1)"
                      : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"></path>
                </svg>
                GitHub
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = encodeURIComponent(from);
                  window.location.href = `/api/auth/google?next=${next}`;
                }}
                className="py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105 border flex items-center justify-center gap-2"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.05)"
                      : "rgba(255, 255, 255, 0.05)",
                  borderColor:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.1)"
                      : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </motion.div>

            {/* Login Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center text-sm opacity-70"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold transition-all hover:opacity-100"
                style={{ color: "var(--accent)" }}
              >
                Sign in here
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
