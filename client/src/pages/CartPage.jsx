import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCart, removeItem, updateItem } from "../redux/slices/cartSlice.js";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import PageMeta from "../components/PageMeta.jsx";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  KeyRound,
} from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const total = items.reduce(
    (sum, item) => sum + (item.product?.finalPrice || 0) * item.quantity,
    0
  );

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateItem({ productId, quantity: newQuantity }));
  };

  const handleRemove = (item) => {
    dispatch(removeItem(item.product?._id || item.product));
    toast(`${item.product?.name || "Item"} removed from cart`, "info");
  };

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
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <PageMeta
        title="Shopping Cart - PricePulseAI"
        description="View and manage the items in your shopping cart on PricePulseAI. Proceed to checkout and enjoy great deals."
      />
      <section className="min-h-screen px-4 py-16 sm:py-20 md:py-24 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                }}
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Shopping Cart
              </h1>
            </div>
            <p className="text-xs sm:text-sm opacity-70">
              {items.length === 0
                ? user
                  ? "let's add some items to your cart"
                  : "please login to add items to your cart"
                : `${items.length} ${
                    items.length === 1 ? "item" : "items"
                  } in your cart`}
            </p>
          </motion.div>

          {items.length === 0 ? (
            /* Empty State */
            <motion.div
              variants={itemVariants}
              className="text-center py-20 rounded-2xl backdrop-blur-xl border"
              style={{
                background:
                  theme === "light"
                    ? "rgba(255, 255, 255, 0.6)"
                    : "rgba(255, 255, 255, 0.02)",
                borderColor:
                  theme === "light"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(155, 89, 182, 0.1)"
                      : "rgba(155, 89, 182, 0.2)",
                }}
              >
                <ShoppingBag
                  className="w-12 h-12"
                  style={{
                    color:
                      theme === "light" ? "var(--primary)" : "var(--accent)",
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">Your cart is empty</h3>
              <p className="opacity-70 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
              {user ? (
                <Link to="/shop">
                  <button
                    className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Start Shopping
                    </div>
                  </button>
                </Link>
              ) : (
                <Link to="/login">
                  <button
                    className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5" />
                      Login to Shop
                    </div>
                  </button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product?._id || item.product}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="rounded-2xl p-6 backdrop-blur-xl border"
                      style={{
                        background:
                          theme === "light"
                            ? "rgba(255, 255, 255, 0.6)"
                            : "rgba(255, 255, 255, 0.02)",
                        borderColor:
                          theme === "light"
                            ? "rgba(0, 0, 0, 0.1)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div
                          className="shrink-0 w-24 h-24 rounded-xl flex items-center justify-center"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(155, 89, 182, 0.1)"
                                : "rgba(155, 89, 182, 0.2)",
                          }}
                        >
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product?.name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <ShoppingBag className="w-10 h-10 opacity-50" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="text-2xl font-black mb-4">
                            ₹{item.product?.finalPrice?.toFixed?.(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center gap-2 rounded-xl p-1"
                              style={{
                                background:
                                  theme === "light"
                                    ? "rgba(0, 0, 0, 0.05)"
                                    : "rgba(255, 255, 255, 0.05)",
                                border:
                                  theme === "light"
                                    ? "1px solid rgba(0, 0, 0, 0.1)"
                                    : "1px solid rgba(255, 255, 255, 0.1)",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product?._id || item.product,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 rounded-lg transition-all hover:scale-110"
                                style={{
                                  background:
                                    theme === "light"
                                      ? "rgba(155, 89, 182, 0.1)"
                                      : "rgba(155, 89, 182, 0.2)",
                                }}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product?._id || item.product,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 rounded-lg transition-all hover:scale-110"
                                style={{
                                  background:
                                    theme === "light"
                                      ? "rgba(155, 89, 182, 0.1)"
                                      : "rgba(155, 89, 182, 0.2)",
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemove(item)}
                              className="p-2 rounded-lg transition-all hover:scale-110 ml-auto"
                              style={{
                                background: "rgba(231, 76, 60, 0.1)",
                                border: "1px solid rgba(231, 76, 60, 0.3)",
                                color: "#e74c3c",
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <div
                            className="mt-4 pt-4 border-t flex justify-between items-center"
                            style={{
                              borderColor:
                                theme === "light"
                                  ? "rgba(0, 0, 0, 0.1)"
                                  : "rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            <span className="text-sm opacity-70">Subtotal</span>
                            <span className="font-bold text-lg">
                              ₹
                              {(
                                (item.product?.finalPrice || 0) * item.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div
                  className="rounded-2xl p-6 backdrop-blur-xl border sticky top-24"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(255, 255, 255, 0.6)"
                        : "rgba(255, 255, 255, 0.02)",
                    borderColor:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="opacity-70">Subtotal</span>
                      <span className="font-semibold">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Shipping</span>
                      <span className="font-semibold text-green-500">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Tax</span>
                      <span className="font-semibold">₹0.00</span>
                    </div>
                  </div>

                  <div
                    className="border-t pt-4 mb-6"
                    style={{
                      borderColor:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-black">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <button
                      className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-105 group"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                      }}
                      disabled={items.length === 0}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </Link>

                  {user ? (
                    <Link to="/shop">
                      <button
                        className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105 mt-3 border"
                        style={{
                          borderColor:
                            theme === "light"
                              ? "rgba(155, 89, 182, 0.3)"
                              : "rgba(155, 89, 182, 0.4)",
                          color:
                            theme === "light"
                              ? "var(--primary)"
                              : "var(--accent)",
                          background:
                            theme === "light"
                              ? "rgba(155, 89, 182, 0.05)"
                              : "rgba(155, 89, 182, 0.1)",
                        }}
                      >
                        Continue Shopping
                      </button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <button
                        className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105 mt-3 border"
                        style={{
                          borderColor:
                            theme === "light"
                              ? "rgba(155, 89, 182, 0.3)"
                              : "rgba(155, 89, 182, 0.4)",
                          color:
                            theme === "light"
                              ? "var(--primary)"
                              : "var(--accent)",
                          background:
                            theme === "light"
                              ? "rgba(155, 89, 182, 0.05)"
                              : "rgba(155, 89, 182, 0.1)",
                        }}
                      >
                        Login to Shop
                      </button>
                    </Link>
                  )}

                  {/* Security Badge */}
                  <div
                    className="mt-6 pt-6 border-t text-center"
                    style={{
                      borderColor:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <p className="text-xs opacity-70 flex items-center justify-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Secure checkout powered by encryption
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
}
