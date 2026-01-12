import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollShopRestore() {
  const location = useLocation();
  const path = location.pathname || "";
  const isShop = path === "/shop" || path.startsWith("/shop/");
  const key = `pp:scroll:${path}${location.search || ""}`;

  // Save scroll position while on shop page
  useEffect(() => {
    if (!isShop) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          try {
            sessionStorage.setItem(key, String(window.scrollY));
          } catch {}
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isShop, key]);

  // Restore scroll position when entering shop page
  useEffect(() => {
    if (!isShop) return;
    let y = 0;
    try {
      const saved = sessionStorage.getItem(key);
      if (saved) y = parseInt(saved, 10) || 0;
    } catch {}

    if (y > 0) {
      let attempts = 0;
      const restore = () => {
        // Attempt multiple times to account for async content load
        window.scrollTo(0, y);
        attempts += 1;
        if (attempts < 5) setTimeout(restore, 100);
      };
      // Initial slight delay so layout is ready
      setTimeout(restore, 50);
    }
  }, [isShop, key]);

  return null;
}
