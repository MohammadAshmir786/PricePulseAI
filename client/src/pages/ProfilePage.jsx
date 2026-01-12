import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  logout,
  updateProfile,
  deleteAccount,
} from "../redux/slices/authSlice.js";
import { fetchOrders } from "../services/orderService.js";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import {
  User,
  Mail,
  Shield,
  ShoppingBag,
  LogOut,
  CreditCard,
  Package,
  Calendar,
  Edit2,
  X,
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal.jsx";
import PageMeta from "../components/PageMeta.jsx";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const gradientStyle = {
    background: "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
  };
  const pageTitle = "My Profile - PricePulseAI";
  const pageDescription =
    "Manage your account settings and view your order history on PricePulseAI.";

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && showEditModal) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, showEditModal]);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data || []))
      .catch(() => setOrders([]));
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteAccount()).unwrap();
      toast("Account deleted", "success");
      navigate("/", { replace: true });
    } catch (err) {
      const message = err?.message || "Failed to delete account";
      toast(message, "error");
    } finally {
      setShowDeleteModal(false);
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(updateProfile(editForm)).unwrap();
      toast("Profile updated successfully!", "success");
      setShowEditModal(false);
    } catch (err) {
      const message = err?.message || "Failed to update profile";
      toast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast("Please select an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast("Image size must be less than 5MB", "error");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditForm({ ...editForm, avatar: event.target.result });
      toast("Image selected successfully", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if we're leaving the drop zone entirely
    if (e.target === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
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

  if (status === "loading" && !user) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div
            className="animate-spin w-12 h-12 border-4 rounded-full mx-auto mb-4"
            style={{
              borderColor:
                theme === "light"
                  ? "rgba(155, 89, 182, 0.2)"
                  : "rgba(155, 89, 182, 0.3)",
              borderTopColor: "var(--accent)",
            }}
          ></div>
          <p className="opacity-70">Loading your profile...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <>
        <PageMeta title={pageTitle} description={pageDescription} />
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="opacity-70">
              We could not load your profile. Please sign in again.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageMeta title={pageTitle} description={pageDescription} />
      <section className="min-h-screen px-4 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl space-y-6"
        >
          <ConfirmModal
            open={showDeleteModal}
            title="Delete account"
            message="This action will permanently delete your account and data. This cannot be undone."
            confirmLabel={isDeleting ? "Deleting..." : "Delete"}
            cancelLabel="Cancel"
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteModal(false)}
            variant="danger"
          />
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              My Profile
            </h1>
            <p className="opacity-70">
              Manage your account settings and view your order history
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-8 backdrop-blur-xl border"
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div
                className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center"
                style={
                  !user.avatar
                    ? gradientStyle
                    : { border: "2px solid var(--accent)" }
                }
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  {user.role && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                      style={{
                        background:
                          user.role === "admin"
                            ? "rgba(231, 76, 60, 0.15)"
                            : "rgba(52, 152, 219, 0.15)",
                        color: user.role === "admin" ? "#e74c3c" : "#3498db",
                      }}
                    >
                      {user.role}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 opacity-70">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.role === "admin" && (
                    <div className="flex items-center gap-2 opacity-70">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Administrator Access</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 border flex items-center gap-2"
                    style={{
                      borderColor:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.3)"
                          : "rgba(155, 89, 182, 0.4)",
                      color: "var(--accent)",
                      background:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.05)"
                          : "rgba(155, 89, 182, 0.1)",
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105"
                    style={gradientStyle}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Go to Checkout
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 border"
                    style={{
                      borderColor:
                        theme === "light"
                          ? "rgba(231, 76, 60, 0.3)"
                          : "rgba(231, 76, 60, 0.4)",
                      color: "#e74c3c",
                      background:
                        theme === "light"
                          ? "rgba(231, 76, 60, 0.05)"
                          : "rgba(231, 76, 60, 0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </div>
                  </button>
                  {user?.role !== "admin" && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      disabled={isDeleting}
                      className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 border"
                      style={{
                        borderColor:
                          theme === "light"
                            ? "rgba(220, 38, 38, 0.35)"
                            : "rgba(248, 113, 113, 0.35)",
                        color: "#ef4444",
                        background:
                          theme === "light"
                            ? "rgba(248, 113, 113, 0.08)"
                            : "rgba(248, 113, 113, 0.12)",
                        opacity: isDeleting ? 0.7 : 1,
                        cursor: isDeleting ? "not-allowed" : "pointer",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div
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
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(52, 152, 219, 0.1)"
                        : "rgba(52, 152, 219, 0.2)",
                  }}
                >
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm opacity-70">Total Orders</span>
              </div>
              <p className="text-3xl font-black">{orders.length}</p>
            </div>

            <div
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
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(46, 204, 113, 0.1)"
                        : "rgba(46, 204, 113, 0.2)",
                  }}
                >
                  <CreditCard className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm opacity-70">Total Spent</span>
              </div>
              <p className="text-3xl font-black">
                ₹
                {orders
                  .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                  .toFixed(2)}
              </p>
            </div>

            <div
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
              <div className="flex items-center gap-3 mb-2">
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
                    style={{ color: "var(--accent)" }}
                  />
                </div>
                <span className="text-sm opacity-70">Total Items</span>
              </div>
              <p className="text-3xl font-black">
                {orders.reduce(
                  (sum, order) =>
                    sum +
                    (order.items?.reduce((s, i) => s + i.quantity, 0) || 0),
                  0
                )}
              </p>
            </div>
          </motion.div>

          {/* Order History */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-8 backdrop-blur-xl border"
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Order History</h3>
                <p className="opacity-70 text-sm">
                  View and track all your previous orders
                </p>
              </div>
              <span
                className="px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(155, 89, 182, 0.1)"
                      : "rgba(155, 89, 182, 0.2)",
                  color: "var(--accent)",
                }}
              >
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <ShoppingBag className="w-8 h-8 opacity-50" />
                </div>
                <p className="opacity-70">You haven't placed any orders yet</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="mt-4 px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  style={gradientStyle}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(255, 255, 255, 0.02)",
                      borderColor:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">
                            Order #{order._id?.slice(-8).toUpperCase()}
                          </span>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background:
                                order.paymentStatus === "paid"
                                  ? "rgba(46, 204, 113, 0.15)"
                                  : "rgba(241, 196, 15, 0.15)",
                              color:
                                order.paymentStatus === "paid"
                                  ? "#27ae60"
                                  : "#f39c12",
                            }}
                          >
                            {order.paymentStatus ||
                              order.paymentMethod ||
                              "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black">
                          ₹{order.totalAmount?.toFixed?.(2) || "0.00"}
                        </p>
                        <p className="text-sm opacity-70">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    <div
                      className="border-t pt-4 mt-4"
                      style={{
                        borderColor:
                          theme === "light"
                            ? "rgba(0, 0, 0, 0.1)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="space-y-2">
                        {(order.items || []).map((item, index) => (
                          <div
                            key={item.product?._id || item.product || index}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="opacity-70">
                              {item.product?.name || "Product"}{" "}
                              <span className="font-semibold">
                                × {item.quantity}
                              </span>
                            </span>
                            <span className="font-semibold">
                              ₹
                              {(
                                (item.product?.finalPrice || 0) *
                                (item.quantity || 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => !isSaving && setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6 backdrop-blur-xl border"
              style={{
                background:
                  theme === "light"
                    ? "rgba(255, 255, 255, 0.95)"
                    : "rgba(0, 0, 0, 0.5)",
                borderColor:
                  theme === "light"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isSaving}
                  className="p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-50"
                  style={{
                    background:
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleEditSubmit}>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm"
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
                    disabled={isSaving}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm"
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
                    disabled={isSaving}
                  />
                </div>

                {/* Avatar Image - With Drag and Drop */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Avatar Image
                  </label>

                  {/* Avatar Preview */}
                  {editForm.avatar && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={editForm.avatar}
                        alt="Avatar preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* File Input */}
                  <input
                    ref={fileInputRef}
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isSaving}
                  />

                  {/* Drag and Drop Zone */}
                  <div
                    ref={dropZoneRef}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{
                      border: `2px dashed ${
                        isDragging
                          ? "var(--accent)"
                          : theme === "light"
                          ? "rgba(155, 89, 182, 0.3)"
                          : "rgba(155, 89, 182, 0.4)"
                      }`,
                      background: isDragging
                        ? theme === "light"
                          ? "rgba(155, 89, 182, 0.08)"
                          : "rgba(155, 89, 182, 0.12)"
                        : "transparent",
                      borderRadius: "14px",
                      padding: "1.25rem",
                      cursor: "pointer",
                      transition:
                        "border-color 0.2s ease, background 0.2s ease",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          color: isDragging ? "var(--accent)" : "currentColor",
                          opacity: isDragging ? 1 : 0.6,
                        }}
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <div>
                        <p className="font-semibold text-sm">
                          {isDragging
                            ? "Drop your image here"
                            : "Drag and drop your image"}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          or click to select
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="w-full px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 border flex items-center justify-center gap-2"
                    style={{
                      borderColor:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.3)"
                          : "rgba(155, 89, 182, 0.4)",
                      color: "var(--accent)",
                      background:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.05)"
                          : "rgba(155, 89, 182, 0.1)",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Choose Image
                  </button>

                  {editForm.avatar && (
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, avatar: "" })}
                      disabled={isSaving}
                      className="w-full mt-2 px-4 py-2 rounded-xl font-semibold transition-all text-sm border"
                      style={{
                        borderColor:
                          theme === "light"
                            ? "rgba(231, 76, 60, 0.3)"
                            : "rgba(231, 76, 60, 0.4)",
                        color: "#e74c3c",
                        background:
                          theme === "light"
                            ? "rgba(231, 76, 60, 0.05)"
                            : "rgba(231, 76, 60, 0.1)",
                      }}
                    >
                      Remove Image
                    </button>
                  )}

                  <p className="text-xs opacity-60 mt-2">
                    Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 border"
                    style={{
                      borderColor:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-70 disabled:scale-100"
                    style={gradientStyle}
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 6v6l4 2"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
}
