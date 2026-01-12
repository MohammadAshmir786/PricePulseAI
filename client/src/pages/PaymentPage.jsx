import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  createPaymentOrder,
  verifyPayment,
} from "../services/paymentService.js";
import { useToast } from "../context/ToastContext.jsx";
import { clearCart } from "../redux/slices/cartSlice.js";
import PageMeta from "../components/PageMeta.jsx";
import {
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, paymentMethod, total, items } = location.state || {};
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { theme } = useTheme();

  const [status, setStatus] = useState("idle");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  if (!address || !paymentMethod) {
    navigate("/checkout");
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const orderData = await createPaymentOrder();
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "PricePulse AI",
        description: "Your order payment",
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
            toast("Payment successful!", "success");
            dispatch(clearCart());
            setTimeout(() => navigate("/"), 2000);
          } catch (err) {
            setStatus("error");
            toast("Payment verification failed. Contact support.", "error");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            toast("Payment cancelled", "info");
          },
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: theme === "light" ? "#9b59b6" : "#bb86fc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setStatus("error");
        toast("Payment failed: " + response.error.description, "error");
      });
      rzp.open();
    } catch (err) {
      setStatus("error");
      toast("Could not initiate payment. Try again.", "error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.08,
        delayChildren: 0.1,
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

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case "Credit Card":
        return <CreditCard className="w-6 h-6" />;
      case "UPI":
        return <Smartphone className="w-6 h-6" />;
      case "Net Banking":
        return <Building2 className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <>
      <PageMeta
        title="Payment - PricePulseAI"
        description="Complete your payment securely on PricePulseAI. Choose your preferred payment method and finalize your order."
      />
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              Complete Payment
            </h1>
            <p className="opacity-60">Secure payment processing</p>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-6 backdrop-blur-xl border mb-8"
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
            <div className="space-y-4">
              {/* Payment Method */}
              <div
                className="flex items-center justify-between pb-4 border-b"
                style={{
                  borderColor:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.1)"
                      : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    }}
                  >
                    {getPaymentIcon()}
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Payment Method</p>
                    <p className="font-semibold">{paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Items Count */}
              {items && items.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Items ({items.length})</span>
                  <span className="font-medium">
                    {items.length} product{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Total Amount */}
              <div
                className="flex items-center justify-between pt-4 border-t"
                style={{
                  borderColor:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.1)"
                      : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <span className="opacity-60">Total Amount</span>
                <span
                  className="text-2xl font-black"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ₹{total?.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.form
            variants={itemVariants}
            className="space-y-4"
            onSubmit={handlePayment}
          >
            {/* Credit Card Form */}
            {paymentMethod === "Credit Card" && (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Card Number
                  </label>
                  <motion.input
                    variants={itemVariants}
                    required
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, number: e.target.value })
                    }
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-xl border transition-all focus:scale-105 focus:outline-none"
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Cardholder Name
                  </label>
                  <motion.input
                    variants={itemVariants}
                    required
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border transition-all focus:scale-105 focus:outline-none"
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
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">
                      Expiry
                    </label>
                    <motion.input
                      variants={itemVariants}
                      required
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiry: e.target.value,
                        })
                      }
                      maxLength={5}
                      className="w-full px-4 py-3 rounded-xl border transition-all focus:scale-105 focus:outline-none"
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">
                      CVV
                    </label>
                    <motion.input
                      variants={itemVariants}
                      required
                      placeholder="•••"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      maxLength={3}
                      className="w-full px-4 py-3 rounded-xl border transition-all focus:scale-105 focus:outline-none"
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
                    />
                  </div>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-2 text-sm opacity-70 mt-4 p-3 rounded-lg"
                  style={{
                    background: "rgba(76, 175, 80, 0.1)",
                    borderLeft: "2px solid rgb(76, 175, 80)",
                  }}
                >
                  <Lock className="w-4 h-4" />
                  Your card information is encrypted and secure
                </motion.div>
              </motion.div>
            )}

            {/* UPI Form */}
            {paymentMethod === "UPI" && (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    UPI ID
                  </label>
                  <motion.input
                    variants={itemVariants}
                    required
                    placeholder="user@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border transition-all focus:scale-105 focus:outline-none"
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
                  />
                </div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-2 text-sm opacity-70 p-3 rounded-lg"
                  style={{
                    background: "rgba(33, 150, 243, 0.1)",
                    borderLeft: "2px solid rgb(33, 150, 243)",
                  }}
                >
                  <Smartphone className="w-4 h-4" />
                  You'll receive a payment request on your UPI app
                </motion.div>
              </motion.div>
            )}

            {/* Net Banking Form */}
            {paymentMethod === "Net Banking" && (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Select Bank
                  </label>
                  <motion.select
                    variants={itemVariants}
                    required
                    className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none"
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
                    <option value="">Select Your Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="other">Other</option>
                  </motion.select>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-2 text-sm opacity-70 p-3 rounded-lg"
                  style={{
                    background: "rgba(156, 39, 176, 0.1)",
                    borderLeft: "2px solid rgb(156, 39, 176)",
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  You'll be redirected to your bank's website
                </motion.div>
              </motion.div>
            )}

            {/* Status Messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: "rgba(76, 175, 80, 0.15)",
                  borderColor: "rgba(76, 175, 80, 0.3)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">
                  Payment successful! Redirecting...
                </span>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  background: "rgba(244, 67, 54, 0.15)",
                  borderColor: "rgba(244, 67, 54, 0.3)",
                }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium">
                  Payment failed. Please try again.
                </span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{
                  background:
                    status === "success"
                      ? "rgba(76, 175, 80, 0.6)"
                      : "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                }}
              >
                {status === "loading" ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Processing...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Payment Done
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹{total?.toFixed(2)}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <motion.button
                variants={itemVariants}
                type="button"
                onClick={() => navigate("/checkout")}
                disabled={status === "loading"}
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 border"
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
              >
                Back
              </motion.button>
            </div>
          </motion.form>

          {/* Security Badge */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center text-sm opacity-50 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            SSL Encrypted • 256-bit Security
          </motion.div>

          <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        </motion.div>
      </section>
    </>
  );
}
