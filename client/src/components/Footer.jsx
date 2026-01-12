import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useSelector } from "react-redux";
import { subscribeToNewsletter } from "../services/newsletterService";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Footer() {
  const { theme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navLinks = [
    { id: 1, to: "/shop", label: "Shop" },
    { id: 2, to: "/cart", label: "Cart" },
    { id: 3, to: "/profile", label: "Profile" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      toast("Please enter your email address", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email address", "error");
      return;
    }

    setIsLoading(true);

    try {
      await subscribeToNewsletter(email);
      toast("Successfully subscribed to newsletter! 🎉", "success");
      setEmail("");
    } catch (error) {
      toast(error.message || "Failed to subscribe. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const footerBg =
    theme === "light"
      ? "linear-gradient(135deg, #121a2e 0%, #1b2540 100%)" // classic deep slate for contrast in light theme
      : "linear-gradient(135deg, #0b0f1e 0%, #0c1024 100%)"; // existing dark hues

  const overlayStyle =
    theme === "light"
      ? {
          background:
            "radial-gradient(60% 60% at 20% 20%, rgba(255,123,95,0.10) 0%, rgba(255,123,95,0) 100%), radial-gradient(50% 50% at 80% 30%, rgba(45,127,249,0.08) 0%, rgba(45,127,249,0) 100%)",
        }
      : {
          background:
            "linear-gradient(135deg, rgba(147,51,234,0.10) 0%, rgba(59,130,246,0.05) 60%, rgba(0,0,0,0) 100%)",
        };

  return (
    <footer
      className="relative overflow-hidden border-t border-white/10 text-white"
      style={{ background: footerBg }}
    >
      <div className="absolute inset-0" style={overlayStyle} />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pt-10 pb-5 md:py-12 lg:py-14 lg:px-8">
        {/* Top CTA */}
        <div className="flex flex-col gap-3 sm:gap-4 rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.15em] md:tracking-[0.18em] text-white/70">
              Stay in the loop
            </p>
            <h3 className="text-lg md:text-2xl font-bold leading-tight mt-1 md:mt-0">
              Weekly drops, price alerts, and AI picks.
            </h3>
          </div>
          <form
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 md:w-auto"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-purple-400 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-linear-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Links grid */}
        <div className="mt-12 grid gap-8 grid-cols-2 md:grid-cols-4">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <Link
              to="/"
              className="text-lg font-bold bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent"
            >
              PricePulse AI
            </Link>
            <p className="text-sm text-white/70">
              Smarter shopping powered by live pricing, AI recommendations, and
              transparent comparisons.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80">Product</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  className="block hover:text-white"
                  to={link.to}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80">Support</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <a className="block hover:text-white" href="#">
                Help Center
              </a>
              <a className="block hover:text-white" href="#">
                Pricing FAQ
              </a>
              <a className="block hover:text-white" href="#">
                Returns
              </a>
              <a className="block hover:text-white" href="#">
                Contact
              </a>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-white/80">Connect</h4>
            <div className="mt-3 flex flex-wrap gap-3">
              {[
                {
                  label: "Twitter",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12.4 8v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                      <path d="M16.5 7.5h.01" />
                      <circle cx="12" cy="12" r="3.5" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58Z" />
                      <path d="m9.75 15.02 5.5-3.02-5.5-3.02v6.04z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  aria-label={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:border-purple-400/60 hover:text-white hover:bg-purple-500/10"
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between text-center">
          <span>
            © {new Date().getFullYear()} PricePulse AI.{isMobile ? <br /> : " "}{" "}
            Licensed under the MIT License.
          </span>

          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <a
              className="hover:text-white"
              href="https://github.com/MohammadAshmir786/PricePulseAI/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License
            </a>

            <a className="hover:text-white" href="/privacy">
              Privacy
            </a>

            <a className="hover:text-white" href="/terms">
              Terms
            </a>

            <a className="hover:text-white" href="/cookies">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
