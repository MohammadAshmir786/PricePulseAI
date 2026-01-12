import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import PriceBadge from "./PriceBadge.jsx";

export default function ProductCard({ product, onAdd, index = 0 }) {
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, Math.min(value, product.stock || 1));
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    onAdd?.(product, quantity);
    setQuantity(1);
  };

  const handleCardClick = (e) => {
    // Only navigate if clicking on the card itself, not on interactive elements
    if (
      !e.target.closest("button") &&
      !e.target.closest("a") &&
      !e.target.closest("[role='button']")
    ) {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <motion.article
      className="group relative rounded-2xl border border-white/10 p-4 shadow-xl hover:shadow-2xl transition-all will-change-transform backdrop-blur-xl flex flex-col h-full cursor-pointer overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        borderImage:
          "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%) 1",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
        delay: Math.min(index * 0.04, 0.4),
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={handleCardClick}
    >
      <button
        aria-label="Wishlist"
        aria-pressed={liked}
        onClick={(e) => {
          e.stopPropagation();
          setLiked((v) => !v);
        }}
        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 transition-all z-10"
      >
        <svg
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke={liked ? "#ff1744" : "currentColor"}
          strokeWidth="1.6"
          className={`h-5 w-5 transition-colors ${liked ? "text-red-500" : ""}`}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <div className="relative mb-4 h-56 overflow-hidden rounded-xl group/image">
        <img
          src={
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
          }
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300" />
        {/* Category Badge */}
        <motion.span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 107, 74, 0.95) 0%, rgba(255, 107, 74, 0.85) 100%)",
            color: "#fff",
            boxShadow: "0 6px 16px rgba(255, 107, 74, 0.5)",
          }}
          whileHover={{ scale: 1.1 }}
        >
          🏷️ {product.category || "Featured"}
        </motion.span>
        {product.stock === 0 && (
          <motion.span
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md"
            style={{
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)",
              color: "#fff",
              boxShadow: "0 6px 16px rgba(239, 68, 68, 0.6)",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✕ Sold out
          </motion.span>
        )}
        {product.stock === 0 && (
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div
              className="block font-semibold tracking-tight line-clamp-2 text-base hover:text-orange-400 transition-colors duration-200 cursor-pointer"
              title={product.name}
            >
              {product.name}
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-sm opacity-90">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 24 24"
                  fill={i < 4 ? "#f5b301" : "none"}
                  stroke="#f5b301"
                  className="h-4 w-4 shrink-0"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.169L12 18.897l-7.336 3.87 1.402-8.169L.132 9.211l8.2-1.193z" />
                </svg>
              ))}
              <span className="ml-1 text-xs opacity-75">(4.0)</span>
            </div>
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {product.tags.slice(0, 2).map((t, i) => {
                  const colors = [
                    {
                      bg: "rgba(45, 127, 249, 0.15)",
                      border: "rgba(45, 127, 249, 0.5)",
                      text: "#2d7ff9",
                    },
                    {
                      bg: "rgba(16, 185, 129, 0.15)",
                      border: "rgba(16, 185, 129, 0.5)",
                      text: "#10b981",
                    },
                  ];
                  const color = colors[i % colors.length];
                  return (
                    <motion.span
                      key={t}
                      className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold truncate backdrop-blur-sm hover:scale-105 transition-transform"
                      style={{
                        background: color.bg,
                        borderColor: color.border,
                        color: color.text,
                      }}
                      title={t}
                    >
                      ✨ {t}
                    </motion.span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="shrink-0">
            <PriceBadge price={product.finalPrice} base={product.basePrice} />
          </div>
        </div>

        <div className="mt-auto pt-4 space-y-3 border-t border-white/5">
          {product.stock === 0 && (
            <span className="text-xs text-red-400 font-semibold block">
              ❌ Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <span className="text-xs text-orange-400 font-semibold block animate-pulse">
              ⚠️ Only {product.stock} left in stock!
            </span>
          )}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-white/15 px-2 py-2 bg-white/5 hover:bg-white/10 transition-colors">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity === 1 || product.stock === 0}
                className="p-1 hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="w-6 text-center font-bold text-sm">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={
                  quantity >= (product.stock || 1) || product.stock === 0
                }
                className="p-1 hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <motion.button
              className="flex-1 rounded-lg px-3 py-2 font-bold text-sm text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: "var(--accent)" }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-disabled={product.stock === 0}
              whileHover={product.stock > 0 ? { scale: 1.05 } : {}}
              whileTap={product.stock > 0 ? { scale: 0.95 } : {}}
            >
              🛒 Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    finalPrice: PropTypes.number,
    basePrice: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    stock: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onAdd: PropTypes.func,
  index: PropTypes.number,
};
