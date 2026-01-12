import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollOnNavigate() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname || "";
    // Skip auto scroll on the shop page (and nested routes under /shop)
    const isShop = path === "/shop" || path.startsWith("/shop/");
    if (!isShop) {
      // Immediate scroll to top on navigation
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}
