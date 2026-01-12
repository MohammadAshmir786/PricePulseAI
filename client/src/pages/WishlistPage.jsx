import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService.js";
import { addItem } from "../redux/slices/cartSlice.js";
import PriceBadge from "../components/PriceBadge.jsx";
import PageMeta from "../components/PageMeta.jsx";
import {
  Heart,
  ShoppingCart,
  ArrowRight,
  Trash2,
  ChevronLeft,
  Zap,
} from "lucide-react";

export default function WishlistPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await getWishlist();
        setWishlistItems(data.items || []);
      } catch (error) {
        toast(error?.message || "Failed to load wishlist", "error");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, navigate]);

  const handleRemoveFromWishlist = async (productId, productName) => {
    setRemovingItem(productId);
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      toast(`${productName} removed from wishlist`, "info");
    } catch (error) {
      toast(error?.message || "Failed to remove from wishlist", "error");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      toast("This product is out of stock", "error");
      return;
    }

    setAddingToCart(product._id);
    try {
      await dispatch(addItem({ productId: product._id, quantity: 1 })).unwrap();
      toast(`${product.name} added to cart!`, "success");
    } catch (error) {
      toast(error?.message || "Failed to add item to cart", "error");
    } finally {
      setAddingToCart(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid var(--accent)",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "var(--text)" }}>Loading wishlist...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="My Wishlist - PricePulseAI"
        description="Manage your wishlist on PricePulseAI. Keep track of your favorite products and add them to your cart with ease."
      />
      <section
        className="min-h-screen px-4 py-24 md:py-32"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glass"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.75rem",
                borderRadius: "14px",
                border:
                  theme === "light"
                    ? "2px solid rgba(255, 123, 95, 0.3)"
                    : "2px solid rgba(255, 123, 95, 0.2)",
                color: "var(--text)",
                cursor: "pointer",
                marginBottom: "2rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                transition: "all 0.3s ease",
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 123, 95, 0.12), rgba(255, 255, 255, 0.8))"
                    : "linear-gradient(135deg, rgba(255, 123, 95, 0.08), transparent)",
              }}
            >
              <ChevronLeft style={{ width: 18, height: 18 }} />
              Back
            </motion.button>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="p-3 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #ff2d55 0%, #ff6b95 100%)",
                }}
              >
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "var(--text)",
                }}
              >
                My Wishlist
              </h1>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
              {wishlistItems.length === 0
                ? "Your wishlist is empty"
                : `${wishlistItems.length} ${
                    wishlistItems.length === 1 ? "item" : "items"
                  } in your wishlist`}
            </p>
          </motion.div>

          {wishlistItems.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="glass"
              style={{
                padding: "4rem 2rem",
                borderRadius: "20px",
                textAlign: "center",
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255, 123, 95, 0.12), rgba(255, 255, 255, 0.9))"
                    : "linear-gradient(135deg, rgba(255, 123, 95, 0.08), rgba(45, 127, 249, 0.08))",
                border:
                  theme === "light"
                    ? "2px solid rgba(255, 123, 95, 0.25)"
                    : "2px solid rgba(255, 123, 95, 0.15)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ marginBottom: "1.5rem" }}
              >
                <Heart
                  style={{
                    width: 64,
                    height: 64,
                    color: "var(--accent)",
                    margin: "0 auto",
                  }}
                />
              </motion.div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                }}
              >
                Your wishlist is empty
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
                Start adding products you love to your wishlist!
              </p>
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "1rem 2rem",
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #ff9d7f 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    boxShadow: "0 8px 24px rgba(255, 123, 95, 0.35)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <ShoppingCart style={{ width: 20, height: 20 }} />
                  Start Shopping
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              <AnimatePresence>
                {wishlistItems.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    exit="exit"
                    className="glass"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      background:
                        theme === "light"
                          ? "linear-gradient(135deg, rgba(255, 123, 95, 0.08), rgba(255, 255, 255, 0.9))"
                          : "linear-gradient(135deg, rgba(255, 123, 95, 0.05), rgba(45, 127, 249, 0.05))",
                      border:
                        theme === "light"
                          ? "2px solid rgba(255, 123, 95, 0.2)"
                          : "2px solid rgba(255, 123, 95, 0.15)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Product Image */}
                    <Link to={`/product/${product._id}`}>
                      <div
                        style={{
                          position: "relative",
                          paddingBottom: "100%",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.3 }}
                          src={
                            product.images?.[0] ||
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
                          }
                          alt={product.name}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />

                        {/* Stock Badge */}
                        {product.stock === 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "0.75rem",
                              right: "0.75rem",
                              background: "rgba(239, 68, 68, 0.9)",
                              color: "#ffffff",
                              padding: "0.5rem 1rem",
                              borderRadius: "8px",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                            }}
                          >
                            Out of Stock
                          </div>
                        )}
                        {product.stock > 0 && product.stock < 5 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "0.75rem",
                              right: "0.75rem",
                              background: "rgba(255, 193, 7, 0.9)",
                              color: "#000000",
                              padding: "0.5rem 1rem",
                              borderRadius: "8px",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Zap style={{ width: 14, height: 14 }} />
                            Only {product.stock} left
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div
                      style={{
                        padding: "1.5rem",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Link to={`/product/${product._id}`}>
                        <h3
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "var(--text)",
                            marginBottom: "0.5rem",
                            textDecoration: "none",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--muted)",
                          marginBottom: "1rem",
                        }}
                      >
                        {product.category}
                      </p>

                      {/* Price */}
                      <div style={{ marginBottom: "1rem" }}>
                        <PriceBadge
                          price={product.finalPrice}
                          base={product.basePrice}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          marginTop: "auto",
                        }}
                      >
                        <motion.button
                          whileHover={{
                            scale: product.stock === 0 ? 1 : 1.05,
                          }}
                          whileTap={{
                            scale: product.stock === 0 ? 1 : 0.95,
                          }}
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            addingToCart === product._id || product.stock === 0
                          }
                          style={{
                            flex: 1,
                            padding: "0.875rem 1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            background:
                              product.stock === 0
                                ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                                : "linear-gradient(135deg, var(--accent) 0%, #ff9d7f 100%)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            border: "none",
                            borderRadius: "10px",
                            cursor:
                              addingToCart === product._id ||
                              product.stock === 0
                                ? "not-allowed"
                                : "pointer",
                            boxShadow:
                              product.stock === 0
                                ? "0 4px 12px rgba(107, 114, 128, 0.25)"
                                : "0 4px 12px rgba(255, 123, 95, 0.25)",
                            transition: "all 0.3s ease",
                            opacity:
                              addingToCart === product._id ||
                              product.stock === 0
                                ? 0.6
                                : 1,
                          }}
                        >
                          {addingToCart === product._id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              style={{
                                width: 16,
                                height: 16,
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                borderTop: "2px solid #ffffff",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <>
                              <ShoppingCart style={{ width: 18, height: 18 }} />
                              <span style={{ fontSize: "0.85rem" }}>Add</span>
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleRemoveFromWishlist(product._id, product.name)
                          }
                          disabled={removingItem === product._id}
                          style={{
                            padding: "0.875rem 1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "10px",
                            border: "2px solid var(--accent)",
                            background: "transparent",
                            color: "var(--accent)",
                            fontWeight: 700,
                            cursor:
                              removingItem === product._id
                                ? "not-allowed"
                                : "pointer",
                            transition: "all 0.3s ease",
                            opacity: removingItem === product._id ? 0.6 : 1,
                          }}
                        >
                          {removingItem === product._id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              style={{
                                width: 16,
                                height: 16,
                                border: "2px solid currentColor",
                                borderTop: "2px solid transparent",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <Trash2 style={{ width: 18, height: 18 }} />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Continue Shopping Button */}
          {wishlistItems.length > 0 && (
            <motion.div
              variants={itemVariants}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "4rem",
              }}
            >
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "1rem 2.5rem",
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #ff9d7f 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    boxShadow: "0 8px 24px rgba(255, 123, 95, 0.35)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Continue Shopping
                  <ArrowRight style={{ width: 20, height: 20 }} />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>
    </>
  );
}
