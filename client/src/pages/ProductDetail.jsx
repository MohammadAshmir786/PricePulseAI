import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { fetchProduct } from "../services/productService.js";
import { fetchSimilarProducts } from "../services/recommendationService.js";
import { addReview, getProductReviews } from "../services/reviewService.js";
import { addItem } from "../redux/slices/cartSlice.js";
import { toggleWishlist, isInWishlist } from "../services/wishlistService.js";
import PriceBadge from "../components/PriceBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";
import PageMeta from "../components/PageMeta.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Star,
  Share2,
  ChevronLeft,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { theme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const pageTitle = product
    ? `${product.name} - PricePulseAI`
    : "Product - PricePulseAI";
  const pageDescription = product
    ? `Buy ${product.name} at the best price on PricePulseAI. Read reviews, compare prices, and make an informed purchase.`
    : "Explore detailed product insights and deals on PricePulseAI.";

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProduct(id);
        setProduct(fetchedProduct);

        // Check if product is in wishlist
        if (user) {
          const inWishlist = await isInWishlist(id);
          setLiked(inWishlist);
        } else {
          setLiked(false);
        }
      } catch (error) {
        setProduct(null);
      }
    };

    loadProduct();
    getProductReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id, user]);

  // Load similar products
  useEffect(() => {
    let active = true;
    setSimilarLoading(true);

    fetchSimilarProducts(id, 6)
      .then((items) => {
        if (active) setSimilar(items);
      })
      .catch(() => {
        if (active) setSimilar([]);
      })
      .finally(() => {
        if (active) setSimilarLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Auto-scroll carousel every 5 seconds; reset timer after any manual change
  useEffect(() => {
    if (similar.length === 0) return undefined;

    const timer = setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1) % similar.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [carouselIndex, similar.length]);

  // Variant animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const handleAddToCart = async (targetProduct = product, qty = quantity) => {
    if (!targetProduct) return;

    if (!user) {
      toast("Please login to add items to cart", "warning");
      return;
    }

    if (targetProduct.stock === 0) {
      toast("This product is out of stock", "error");
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(
        addItem({ productId: targetProduct._id, quantity: qty })
      ).unwrap();
      toast(`${targetProduct.name} added to cart!`, "success");
      if (targetProduct._id === product?._id) {
        setQuantity(1);
      }
    } catch (err) {
      if (err?.status === 401) {
        toast("Please login to add items to cart", "warning");
      } else {
        toast(err?.message || "Failed to add item to cart", "error");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast("Please login to add items to wishlist", "warning");
      navigate("/login");
      return;
    }

    setIsLoadingWishlist(true);
    try {
      await toggleWishlist(product._id);
      setLiked(!liked);
      toast(
        liked ? "Removed from wishlist" : "Added to wishlist!",
        liked ? "info" : "success"
      );
    } catch (error) {
      toast(error?.message || "Failed to update wishlist", "error");
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = product?.name || "Check this product";
    const text =
      product?.description || "Have a look at this product on PricePulseAI.";

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        toast("Thanks for sharing!", "success");
        return;
      } catch (err) {
        // If user cancels, don't treat as error; otherwise fall back to clipboard
        if (
          err &&
          (err.name === "AbortError" || err.message?.includes("Abort"))
        ) {
          toast("Share cancelled", "warning");
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard", "success");
    } catch (err) {
      toast("Unable to share or copy link", "error");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast("Please login to submit a review", "error");
      navigate("/login");
      return;
    }

    if (rating === 0) {
      toast("Please select a rating", "error");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview(id, rating, comment);
      toast("Review submitted successfully!", "success");
      setRating(0);
      setComment("");

      // Refresh reviews
      const updatedReviews = await getProductReviews(id);
      setReviews(updatedReviews);

      // Refresh product to get updated rating
      const updatedProduct = await fetchProduct(id);
      setProduct(updatedProduct);
    } catch (error) {
      toast(error.message || "Failed to submit review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? similar.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % similar.length);
  };

  // Loading state
  if (!product)
    return (
      <>
        <PageMeta title={pageTitle} description={pageDescription} />
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
          <p style={{ color: "var(--text)" }}>Loading product...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </>
    );

  return (
    <>
      <PageMeta title={pageTitle} description={pageDescription} />
      <div style={{ backgroundColor: "var(--bg)" }} className="py-40">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerVariants}
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}
        >
          {/* Back button */}
          <motion.button
            variants={itemVariants}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "start",
            }}
            className="responsive-grid"
          >
            {/* Image Section */}
            <motion.div
              variants={containerVariants}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className="glass"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "1",
                  width: "100%",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={
                    product.images?.[0] ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
                  }
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.08 }}
                  className="tag"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    background:
                      "linear-gradient(135deg, var(--accent), #ff9d7f)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "50px",
                    boxShadow: "0 8px 24px rgba(255, 123, 95, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>✨</span>
                  {product.category || "Featured"}
                </motion.div>

                {/* Like Button */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{
                    scale: isLoadingWishlist ? 1 : 1.1,
                    rotate: liked ? 0 : [0, -10, 10, -10, 0],
                  }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleWishlistToggle}
                  disabled={isLoadingWishlist}
                  className="glass"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    width: 64,
                    height: 64,
                    borderRadius: "20px",
                    background: liked
                      ? "linear-gradient(135deg, #ff2d55 0%, #ff6b95 50%, #ff8fb5 100%)"
                      : theme === "light"
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))",
                    border: liked
                      ? "2px solid rgba(255, 255, 255, 0.4)"
                      : theme === "light"
                      ? "2px solid rgba(255, 45, 85, 0.2)"
                      : "2px solid rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isLoadingWishlist ? "not-allowed" : "pointer",
                    color: liked
                      ? "#ffffff"
                      : theme === "light"
                      ? "#ff2d55"
                      : "#ff6b95",
                    backdropFilter: "blur(12px)",
                    boxShadow: liked
                      ? "0 12px 32px rgba(255, 45, 85, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
                      : theme === "light"
                      ? "0 6px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 45, 85, 0.1) inset"
                      : "0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "visible",
                    opacity: isLoadingWishlist ? 0.7 : 1,
                  }}
                >
                  <motion.div
                    animate={
                      liked
                        ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, 15, -15, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {isLoadingWishlist ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{
                          width: 26,
                          height: 26,
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTop: "2px solid currentColor",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <Heart
                        style={{ width: 26, height: 26 }}
                        fill={liked ? "currentColor" : "none"}
                        strokeWidth={2.5}
                      />
                    )}
                  </motion.div>

                  {/* Sparkle effect when liked */}
                  {liked && !isLoadingWishlist && (
                    <>
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          borderRadius: "20px",
                          border: "2px solid rgba(255, 255, 255, 0.6)",
                        }}
                      />
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                          animate={{
                            scale: [0, 1, 0],
                            x: [0, Math.cos((i * Math.PI) / 3) * 30],
                            y: [0, Math.sin((i * Math.PI) / 3) * 30],
                            opacity: [1, 1, 0],
                          }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          style={{
                            position: "absolute",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.9)",
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              variants={containerVariants}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                justifyContent: "flex-start",
              }}
            >
              {/* Title & Category */}
              <div>
                <motion.p
                  variants={itemVariants}
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {product.category}
                </motion.p>
                <motion.h1
                  variants={itemVariants}
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    marginBottom: "1rem",
                    lineHeight: 1.2,
                    color: "var(--text)",
                  }}
                >
                  {product.name}
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  style={{
                    fontSize: "1rem",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {product.description}
                </motion.p>
              </div>

              {/* Pricing */}
              <motion.div variants={itemVariants}>
                <PriceBadge
                  price={product.finalPrice}
                  base={product.basePrice}
                />
              </motion.div>

              {/* Benefits */}
              <motion.div
                variants={staggerVariants}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                }}
              >
                <motion.div
                  variants={itemVariants}
                  className="glass"
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    borderRadius: "14px",
                    background:
                      theme === "light"
                        ? "linear-gradient(135deg, rgba(255, 123, 95, 0.12), rgba(255, 255, 255, 0.9))"
                        : "linear-gradient(135deg, rgba(255, 123, 95, 0.08), rgba(45, 127, 249, 0.08))",
                    border:
                      theme === "light"
                        ? "2px solid rgba(255, 123, 95, 0.25)"
                        : "2px solid rgba(255, 123, 95, 0.15)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Truck
                      style={{
                        width: 28,
                        height: 28,
                        margin: "0 auto 0.75rem",
                        color: "var(--accent)",
                      }}
                    />
                  </motion.div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Fast Delivery
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="glass"
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    borderRadius: "14px",
                    background:
                      theme === "light"
                        ? "linear-gradient(135deg, rgba(255, 123, 95, 0.12), rgba(255, 255, 255, 0.9))"
                        : "linear-gradient(135deg, rgba(255, 123, 95, 0.08), rgba(45, 127, 249, 0.08))",
                    border:
                      theme === "light"
                        ? "2px solid rgba(255, 123, 95, 0.25)"
                        : "2px solid rgba(255, 123, 95, 0.15)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <RotateCcw
                      style={{
                        width: 28,
                        height: 28,
                        margin: "0 auto 0.75rem",
                        color: "var(--accent)",
                      }}
                    />
                  </motion.div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    7-Day Returns
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="glass"
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    borderRadius: "14px",
                    background:
                      theme === "light"
                        ? "linear-gradient(135deg, rgba(255, 123, 95, 0.12), rgba(255, 255, 255, 0.9))"
                        : "linear-gradient(135deg, rgba(255, 123, 95, 0.08), rgba(45, 127, 249, 0.08))",
                    border:
                      theme === "light"
                        ? "2px solid rgba(255, 123, 95, 0.25)"
                        : "2px solid rgba(255, 123, 95, 0.15)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Star
                      style={{
                        width: 28,
                        height: 28,
                        margin: "0 auto 0.75rem",
                        color: "var(--accent)",
                        fill: "var(--accent)",
                      }}
                    />
                  </motion.div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Top Rated
                  </p>
                </motion.div>
              </motion.div>

              {/* Quantity & Actions */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Quantity Selector */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    Quantity:
                  </span>
                  <div
                    className="glass"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "14px",
                      padding: "0.75rem 0.5rem",
                      gap: "0.5rem",
                      background:
                        theme === "light"
                          ? "linear-gradient(135deg, rgba(255, 123, 95, 0.1), rgba(255, 255, 255, 0.9))"
                          : "linear-gradient(135deg, rgba(255, 123, 95, 0.05), rgba(45, 127, 249, 0.05))",
                      border:
                        theme === "light"
                          ? "2px solid rgba(255, 123, 95, 0.3)"
                          : "2px solid rgba(255, 123, 95, 0.2)",
                      opacity: product.stock === 0 ? 0.5 : 1,
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: product.stock === 0 ? 1 : 1.1 }}
                      whileTap={{ scale: product.stock === 0 ? 1 : 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity === 1 || product.stock === 0}
                      style={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        background: "rgba(255, 123, 95, 0.15)",
                        border: "none",
                        borderRadius: "8px",
                        cursor:
                          quantity === 1 || product.stock === 0
                            ? "not-allowed"
                            : "pointer",
                        color: "var(--accent)",
                        fontSize: "1.2rem",
                        transition: "all 0.2s ease",
                        opacity:
                          quantity === 1 || product.stock === 0 ? 0.5 : 1,
                      }}
                    >
                      −
                    </motion.button>
                    <span
                      style={{
                        width: 45,
                        textAlign: "center",
                        fontWeight: 800,
                        color: "var(--text)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: product.stock === 0 ? 1 : 1.1 }}
                      whileTap={{ scale: product.stock === 0 ? 1 : 0.9 }}
                      onClick={() =>
                        setQuantity(Math.min(product.stock || 1, quantity + 1))
                      }
                      disabled={
                        quantity >= (product.stock || 1) || product.stock === 0
                      }
                      style={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        background: "rgba(255, 123, 95, 0.15)",
                        border: "none",
                        borderRadius: "8px",
                        cursor:
                          quantity >= (product.stock || 1) ||
                          product.stock === 0
                            ? "not-allowed"
                            : "pointer",
                        color: "var(--accent)",
                        fontSize: "1.2rem",
                        transition: "all 0.2s ease",
                        opacity:
                          quantity >= (product.stock || 1) ||
                          product.stock === 0
                            ? 0.5
                            : 1,
                      }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Stock Information */}
                <motion.div
                  variants={itemVariants}
                  style={{
                    display: product.stock === 0 ? "none" : "flex",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    background:
                      product.stock < 5
                        ? "rgba(255, 193, 7, 0.12)"
                        : "rgba(16, 185, 129, 0.12)",
                    border:
                      product.stock < 5
                        ? "1px solid rgba(255, 193, 7, 0.3)"
                        : "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: product.stock < 5 ? "#ffc107" : "#10b981",
                    }}
                  >
                    {product.stock < 5
                      ? `⚠️ Only ${product.stock} left in stock`
                      : `✅ ${product.stock} in stock`}
                  </span>
                </motion.div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <motion.button
                    whileHover={{
                      scale: isAddingToCart || product.stock === 0 ? 1 : 1.03,
                    }}
                    whileTap={{
                      scale: isAddingToCart || product.stock === 0 ? 1 : 0.97,
                    }}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock === 0}
                    style={{
                      flex: 1,
                      padding: "1rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      background:
                        product.stock === 0
                          ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                          : "linear-gradient(135deg, var(--accent) 0%, #ff9d7f 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "1rem",
                      border: "none",
                      borderRadius: "14px",
                      cursor:
                        isAddingToCart || product.stock === 0
                          ? "not-allowed"
                          : "pointer",
                      boxShadow:
                        product.stock === 0
                          ? "0 8px 24px rgba(107, 114, 128, 0.35)"
                          : "0 8px 24px rgba(255, 123, 95, 0.35)",
                      transition: "all 0.3s ease",
                      opacity: isAddingToCart || product.stock === 0 ? 0.6 : 1,
                    }}
                  >
                    {isAddingToCart ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{
                            width: 20,
                            height: 20,
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            borderTop: "2px solid #ffffff",
                            borderRadius: "50%",
                          }}
                        />
                        Adding...
                      </>
                    ) : product.stock === 0 ? (
                      <>Out of Stock</>
                    ) : (
                      <>
                        <ShoppingCart style={{ width: 22, height: 22 }} />
                        Add to Cart
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "1rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      borderRadius: "14px",
                      border: "2px solid var(--accent)",
                      background: "transparent",
                      color: "var(--accent)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={handleShare}
                    aria-label="Share product"
                  >
                    <Share2 style={{ width: 22, height: 22 }} />
                    Share
                  </motion.button>
                </div>
              </motion.div>

              {/* Stock Alert */}
              {product.stock > 0 && product.stock < 5 && (
                <motion.div
                  variants={itemVariants}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1.2rem 1.5rem",
                    borderRadius: "14px",
                    background:
                      theme === "light"
                        ? "linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 255, 255, 0.9))"
                        : "linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))",
                    border:
                      theme === "light"
                        ? "2px solid rgba(255, 193, 7, 0.4)"
                        : "2px solid rgba(255, 193, 7, 0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap style={{ width: 20, height: 20, color: "#ffc107" }} />
                  </motion.div>
                  <span
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text)",
                      fontWeight: 600,
                    }}
                  >
                    Only a few left in stock - Order now!
                  </span>
                </motion.div>
              )}

              {/* Security Info */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  textAlign: "center",
                }}
              >
                ✓ Secure checkout • ✓ Money-back guarantee
              </motion.p>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div
            variants={containerVariants}
            style={{
              marginTop: "4rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            {/* Reviews Header */}
            <div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                }}
              >
                Customer Reviews
              </h2>
              {product.ratingCount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: 20,
                          height: 20,
                          color: "var(--accent)",
                          fill:
                            i < Math.round(product.ratingAverage)
                              ? "var(--accent)"
                              : "none",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>
                    {product.ratingAverage?.toFixed(1)} ({product.ratingCount}{" "}
                    reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Similar Products Carousel */}
            <div style={{ marginTop: "3rem" }}>
              <motion.div
                variants={itemVariants}
                style={{ marginBottom: "2rem" }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.55rem 1.2rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255, 123, 95, 0.3)",
                    background:
                      theme === "light"
                        ? "rgba(255, 123, 95, 0.12)"
                        : "rgba(255, 123, 95, 0.08)",
                    fontWeight: 700,
                    color: "var(--text)",
                    width: "fit-content",
                  }}
                >
                  <Zap
                    style={{ width: 18, height: 18, color: "var(--accent)" }}
                  />
                  Similar picks
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    marginTop: "0.6rem",
                    color: "var(--text)",
                  }}
                >
                  You might also like
                </h3>
                <p style={{ color: "var(--muted)", marginTop: "0.2rem" }}>
                  Curated alternatives based on this product.
                </p>
              </motion.div>

              {similarLoading ? (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    overflow: "hidden",
                    padding: "1rem 0",
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="glass animate-pulse"
                      style={{
                        height: 300,
                        minWidth: "280px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.05)",
                        flex: "0 0 280px",
                      }}
                    />
                  ))}
                </div>
              ) : similar.length > 0 ? (
                <motion.div
                  style={{
                    position: "relative",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,123,95,0.1) 50%, transparent)",
                    borderRadius: "20px",
                    padding: "2rem 5rem",
                    overflow: "visible",
                  }}
                >
                  {/* Carousel Container */}
                  <motion.div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      overflow: "hidden",
                      padding: "0 1rem",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "450px",
                      width: "100%",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Main Featured Product */}
                    <motion.div
                      key={similar[carouselIndex]?._id}
                      initial={{ opacity: 0, scale: 0.8, x: 100 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -100 }}
                      transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      style={{
                        flex: "0 0 auto",
                        width: "420px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {similar[carouselIndex] && (
                        <ProductCard
                          product={similar[carouselIndex]}
                          onAdd={(p) => handleAddToCart(p, 1)}
                          index={0}
                        />
                      )}
                    </motion.div>

                    {/* Side Products Preview */}
                    <motion.div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flex: "0 0 auto",
                        opacity: 0.6,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[1, 2].map((offset) => {
                        const idx = (carouselIndex + offset) % similar.length;
                        return (
                          <motion.div
                            initial={{ opacity: 0.6, scale: 0.85 }}
                            key={`preview-${idx}`}
                            onClick={() => setCarouselIndex(idx)}
                            style={{
                              flex: "0 0 200px",
                              height: "280px",
                              borderRadius: "16px",
                              overflow: "hidden",
                              cursor: "pointer",
                              transform: "scale(0.85)",
                              transformOrigin: "left center",
                            }}
                            whileHover={{
                              scale: 0.95,
                              opacity: 1,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "16px",
                                overflow: "hidden",
                                border: "2px solid rgba(255, 123, 95, 0.3)",
                              }}
                              className="glass"
                            >
                              <img
                                src={
                                  similar[idx]?.images?.[0] ||
                                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
                                }
                                alt={similar[idx]?.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>

                  {/* Navigation Buttons - Left */}
                  <motion.button
                    initial={{ y: "-50%", scale: 1 }}
                    whileHover={{
                      scale: 1.15,
                      boxShadow: "0 12px 32px rgba(255, 123, 95, 0.6)",
                    }}
                    whileTap={{ scale: 0.85 }}
                    onClick={handlePrevSlide}
                    className="glass"
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      border: "2.5px solid rgba(255, 123, 95, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      background:
                        "linear-gradient(135deg, rgba(255, 123, 95, 0.15), rgba(255, 123, 95, 0.08))",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      backdropFilter: "blur(12px)",
                      boxShadow:
                        "0 8px 24px rgba(255, 123, 95, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                      zIndex: 15,
                    }}
                  >
                    <motion.div
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ChevronLeft size={28} strokeWidth={2.5} />
                    </motion.div>
                  </motion.button>

                  {/* Navigation Buttons - Right */}
                  <motion.button
                    initial={{ y: "-50%", scale: 1 }}
                    whileHover={{
                      scale: 1.15,
                      boxShadow: "0 12px 32px rgba(255, 123, 95, 0.6)",
                    }}
                    whileTap={{ scale: 0.85 }}
                    onClick={handleNextSlide}
                    className="glass"
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      border: "2.5px solid rgba(255, 123, 95, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      background:
                        "linear-gradient(135deg, rgba(255, 123, 95, 0.15), rgba(255, 123, 95, 0.08))",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      backdropFilter: "blur(12px)",
                      boxShadow:
                        "0 8px 24px rgba(255, 123, 95, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                      zIndex: 15,
                    }}
                  >
                    <motion.div
                      animate={{ x: [2, -2, 2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ChevronRight size={28} strokeWidth={2.5} />
                    </motion.div>
                  </motion.button>

                  {/* Carousel Indicators */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.5rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    {similar.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        animate={{
                          width: carouselIndex === idx ? 32 : 8,
                          backgroundColor:
                            carouselIndex === idx
                              ? "var(--accent)"
                              : "rgba(255, 123, 95, 0.3)",
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                          height: 8,
                          borderRadius: "999px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="glass"
                  style={{ padding: "1.5rem", borderRadius: "14px" }}
                >
                  <p style={{ color: "var(--muted)" }}>
                    No similar products available right now.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Review Form */}
            {user && (
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmitReview}
                className="glass"
                style={{
                  padding: "2.5rem",
                  borderRadius: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.75rem",
                  background:
                    theme === "light"
                      ? "linear-gradient(135deg, rgba(255, 123, 95, 0.1), rgba(255, 255, 255, 0.95))"
                      : "linear-gradient(135deg, rgba(255, 123, 95, 0.05), rgba(45, 127, 249, 0.05))",
                  border:
                    theme === "light"
                      ? "2px solid rgba(255, 123, 95, 0.25)"
                      : "2px solid rgba(255, 123, 95, 0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "var(--text)",
                  }}
                >
                  ✨ Write a Review
                </h3>

                {/* Star Rating */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    Your Rating
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.25rem",
                        }}
                      >
                        <Star
                          style={{
                            width: 32,
                            height: 32,
                            color: "var(--accent)",
                            fill: star <= rating ? "var(--accent)" : "none",
                            transition: "all 0.2s",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "12px",
                      border:
                        theme === "light"
                          ? "2px solid rgba(0, 0, 0, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.05)",
                      color: "var(--text)",
                      fontSize: "0.95rem",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  style={{
                    alignSelf: "flex-start",
                    padding: "0.875rem 2rem",
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #ff9d7f 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    border: "none",
                    borderRadius: "12px",
                    cursor: isSubmittingReview ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(255, 123, 95, 0.3)",
                    transition: "all 0.3s ease",
                    opacity: isSubmittingReview ? 0.7 : 1,
                  }}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </motion.form>
            )}

            {/* Reviews List */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {reviews.length === 0 ? (
                <div
                  className="glass"
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    borderRadius: "16px",
                  }}
                >
                  <p style={{ color: "var(--muted)", fontSize: "1rem" }}>
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass"
                    style={{
                      padding: "1.75rem",
                      borderRadius: "16px",
                      background:
                        theme === "light"
                          ? "linear-gradient(135deg, rgba(255, 123, 95, 0.08), rgba(255, 255, 255, 0.95))"
                          : "linear-gradient(135deg, rgba(255, 123, 95, 0.05), rgba(45, 127, 249, 0.05))",
                      border:
                        theme === "light"
                          ? "2px solid rgba(255, 123, 95, 0.2)"
                          : "2px solid rgba(255, 123, 95, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            color: "var(--text)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {review.user?.name || "Anonymous"}
                        </p>
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              style={{
                                width: 16,
                                height: 16,
                                color: "var(--accent)",
                                fill:
                                  i < review.rating ? "var(--accent)" : "none",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <span
                        style={{ fontSize: "0.85rem", color: "var(--muted)" }}
                      >
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p
                        style={{
                          color: "var(--muted)",
                          lineHeight: 1.6,
                          fontSize: "0.95rem",
                        }}
                      >
                        {review.comment}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
        <style>{`
        @media (max-width: 1024px) {
          .responsive-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }

        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
      </div>
    </>
  );
}
