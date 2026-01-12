import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, loadCart } from "../redux/slices/cartSlice.js";
import { createOrder } from "../services/orderService.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../services/paymentService.js";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import PageMeta from "../components/PageMeta.jsx";
import {
  MapPin,
  CreditCard,
  Package,
  CheckCircle,
  AlertCircle,
  Truck,
  ShoppingBag,
  Lock,
  Banknote,
  Wallet,
  Building2,
} from "lucide-react";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const { toast } = useToast();
  const { theme } = useTheme();

  const [address, setAddress] = useState({ line1: "", city: "", zip: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.finalPrice || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = subtotal + shipping + tax;

  const launchOnlinePayment = async () => {
    if (typeof window === "undefined" || !window.Razorpay) {
      toast("Payment widget not loaded. Please retry in a moment.", "error");
      return;
    }

    setStatus("loading");
    try {
      const orderData = await createPaymentOrder();

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "PricePulse AI",
        description: "Complete your order",
        handler: async (response) => {
          try {
            setStatus("verifying");
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address,
              paymentMethod,
            });
            setStatus("success");
            dispatch(clearCart());
            toast("Payment successful!", "success");
            setTimeout(() => navigate("/"), 1500);
          } catch (err) {
            setStatus("error");
            toast(
              "Payment verification failed. Please contact support.",
              "error"
            );
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            toast("Payment cancelled", "info");
          },
        },
        theme: {
          color: theme === "light" ? "#9b59b6" : "#bb86fc",
        },
        notes: {
          address: address.line1 || "",
        },
      });

      rzp.on("payment.failed", (resp) => {
        setStatus("error");
        toast(
          resp?.error?.description || "Payment failed. Try again.",
          "error"
        );
      });

      rzp.open();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Could not start payment.";
      setStatus("error");
      toast(message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Online payments: launch Razorpay directly
    if (paymentMethod !== "COD") {
      await launchOnlinePayment();
      return;
    }

    // Process COD order directly
    setStatus("loading");
    try {
      await createOrder({ address, paymentMethod });
      setStatus("success");
      dispatch(clearCart());
      toast("Order placed! Cash on delivery selected.", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setStatus("error");
      toast("Order failed. Please try again.", "error");
    }
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
  };

  const paymentOptions = [
    {
      value: "COD",
      label: "Cash on Delivery",
      icon: Banknote,
      recommended: true,
    },
    {
      value: "Credit Card",
      label: "Credit Card",
      icon: CreditCard,
      recommended: false,
    },
    { value: "UPI", label: "UPI", icon: Wallet, recommended: false },
    {
      value: "Net Banking",
      label: "Net Banking",
      icon: Building2,
      recommended: false,
    },
  ];

  return (
    <>
      <PageMeta
        title="Checkout - PricePulseAI"
        description="Complete your purchase on PricePulseAI. Enter your shipping details, choose a payment method, and place your order securely."
      />
      <section className="min-h-screen px-4 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="p-3 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Checkout
              </h1>
            </div>
            <p className="opacity-70">
              Complete your order - Just a few steps away from your purchase
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <motion.div
                variants={itemVariants}
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
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.1)"
                          : "rgba(155, 89, 182, 0.2)",
                    }}
                  >
                    <MapPin
                      className="w-5 h-5"
                      style={{
                        color:
                          theme === "light"
                            ? "var(--primary)"
                            : "var(--accent)",
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="address-line1"
                      className="block text-sm font-semibold mb-2 opacity-70"
                    >
                      Address Line
                    </label>
                    <input
                      required
                      type="text"
                      name="address-line1"
                      id="address-line1"
                      placeholder="Enter your full address"
                      value={address.line1}
                      onChange={(e) =>
                        setAddress({ ...address, line1: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{
                        background:
                          theme === "light"
                            ? "rgba(255, 255, 255, 0.8)"
                            : "rgba(255, 255, 255, 0.05)",
                        borderColor:
                          theme === "light"
                            ? "rgba(0, 0, 0, 0.1)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-semibold mb-2 opacity-70"
                      >
                        City
                      </label>
                      <input
                        required
                        type="text"
                        name="city"
                        id="city"
                        placeholder="Enter city"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(255, 255, 255, 0.05)",
                          borderColor:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.1)"
                              : "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-sm font-semibold mb-2 opacity-70"
                      >
                        ZIP Code
                      </label>
                      <input
                        required
                        type="text"
                        name="zip"
                        id="zip"
                        placeholder="Enter ZIP"
                        value={address.zip}
                        onChange={(e) =>
                          setAddress({ ...address, zip: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(255, 255, 255, 0.05)",
                          borderColor:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.1)"
                              : "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(155, 89, 182, 0.1)"
                              : "rgba(155, 89, 182, 0.2)",
                        }}
                      >
                        <CreditCard
                          className="w-5 h-5"
                          style={{
                            color:
                              theme === "light"
                                ? "var(--primary)"
                                : "var(--accent)",
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-bold">Payment Method</h3>
                    </div>

                    <div className="grid gap-3">
                      {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]"
                            style={{
                              background:
                                paymentMethod === option.value
                                  ? theme === "light"
                                    ? "rgba(155, 89, 182, 0.1)"
                                    : "rgba(155, 89, 182, 0.15)"
                                  : theme === "light"
                                  ? "rgba(255, 255, 255, 0.5)"
                                  : "rgba(255, 255, 255, 0.03)",
                              borderColor:
                                paymentMethod === option.value
                                  ? theme === "light"
                                    ? "var(--primary)"
                                    : "var(--accent)"
                                  : theme === "light"
                                  ? "rgba(0, 0, 0, 0.1)"
                                  : "rgba(255, 255, 255, 0.1)",
                              borderWidth:
                                paymentMethod === option.value ? "2px" : "1px",
                            }}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={option.value}
                              checked={paymentMethod === option.value}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-4 h-4"
                              style={{
                                accentColor:
                                  theme === "light"
                                    ? "var(--primary)"
                                    : "var(--accent)",
                              }}
                            />
                            <Icon className="w-5 h-5 opacity-70" />
                            <span className="font-semibold flex-1">
                              {option.label}
                            </span>
                            {option.recommended && (
                              <span
                                className="text-xs px-3 py-1 rounded-full font-bold"
                                style={{
                                  background:
                                    "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                                  color: "white",
                                }}
                              >
                                Recommended
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      status === "loading" ||
                      status === "verifying" ||
                      status === "success"
                    }
                    className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {status === "loading" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Payment...
                        </>
                      ) : status === "verifying" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Verifying Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Place Order
                        </>
                      )}
                    </div>
                  </button>

                  {/* Status Messages */}
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 rounded-xl"
                      style={{
                        background: "rgba(46, 213, 115, 0.1)",
                        border: "1px solid rgba(46, 213, 115, 0.3)",
                        color: "#2ed573",
                      }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">
                        Order placed successfully! Redirecting...
                      </span>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-4 rounded-xl"
                      style={{
                        background: "rgba(231, 76, 60, 0.1)",
                        border: "1px solid rgba(231, 76, 60, 0.3)",
                        color: "#e74c3c",
                      }}
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">
                        Order failed. Please try again.
                      </span>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
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
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.1)"
                          : "rgba(155, 89, 182, 0.2)",
                    }}
                  >
                    <ShoppingBag
                      className="w-5 h-5"
                      style={{
                        color:
                          theme === "light"
                            ? "var(--primary)"
                            : "var(--accent)",
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold">Order Summary</h3>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold opacity-70 mb-3">
                    Items ({items.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.product?._id}
                        className="flex justify-between items-start text-sm p-2 rounded-lg"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.03)"
                              : "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <span className="flex-1">
                          {item.product?.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ₹
                          {(
                            (item.product?.finalPrice || 0) * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div
                  className="space-y-3 mb-6 pb-6 border-b"
                  style={{
                    borderColor:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Subtotal</span>
                    <span className="font-semibold">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-500">FREE</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Tax (GST 18%)</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  {shipping === 0 && (
                    <div
                      className="text-xs p-2 rounded-lg flex items-center gap-2"
                      style={{
                        background: "rgba(46, 213, 115, 0.1)",
                        color: "#2ed573",
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Free shipping on orders above ₹1000
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                {/* Payment Method Badge */}
                <div
                  className="p-3 rounded-xl text-center text-sm font-semibold"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(155, 89, 182, 0.1)"
                        : "rgba(155, 89, 182, 0.15)",
                    border:
                      theme === "light"
                        ? "1px solid rgba(155, 89, 182, 0.3)"
                        : "1px solid rgba(155, 89, 182, 0.3)",
                  }}
                >
                  Payment: {paymentMethod}
                </div>

                {/* Security Badge */}
                <div
                  className="mt-4 pt-4 border-t text-center"
                  style={{
                    borderColor:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <p className="text-xs opacity-70 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
