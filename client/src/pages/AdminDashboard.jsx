import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../services/orderService.js";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  syncProduct,
  searchProductWeb,
} from "../services/productService.js";
import {
  createAdmin,
  listAdmins,
  updateAdminPrivileges,
  deleteAdmin,
  getProfile,
} from "../services/authService.js";
import { useToast } from "../context/ToastContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  X,
  TrendingUp,
  Box,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal.jsx";
import PageMeta from "../components/PageMeta.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [productQuery, setProductQuery] = useState("");
  const [tab, setTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [adminFormOpen, setAdminFormOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    privileges: [],
  });
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [adminDeleting, setAdminDeleting] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    finalPrice: "",
    stock: 0,
    images: "",
  });
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getProfile();
        setCurrentUser(profile);

        // Only superAdmins can view admins
        if (profile?.isSuperAdmin) {
          const adminList = await listAdmins();
          setAdmins(adminList);
        } else {
          setAdmins([]);
        }
      } catch (err) {
        setCurrentUser(null);
        setAdmins([]);
      }

      fetchOrders()
        .then(setOrders)
        .catch(() => setOrders([]));
      fetchProducts({ limit: 50 })
        .then((res) => setProducts(res.items || res))
        .catch(() => setProducts([]));
    };

    loadData();
  }, []);

  // Admin management functions
  const resetAdminForm = () => {
    setEditingAdminId(null);
    setAdminForm({
      name: "",
      email: "",
      password: "",
      privileges: [],
    });
  };

  const closeAdminFormModal = () => {
    setAdminFormOpen(false);
    resetAdminForm();
  };

  const openCreateAdminModal = () => {
    resetAdminForm();
    setAdminFormOpen(true);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      toast("Please fill all required fields", "error");
      return;
    }
    setSaving(true);
    try {
      await createAdmin({
        name: adminForm.name,
        email: adminForm.email,
        password: adminForm.password,
        privileges: adminForm.privileges,
      });
      toast("Admin created successfully", "success");
      const adminList = await listAdmins();
      setAdmins(adminList);
      closeAdminFormModal();
    } catch (err) {
      toast(err.message || "Failed to create admin", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAdminPrivileges = async (adminId, newPrivileges) => {
    try {
      await updateAdminPrivileges(adminId, newPrivileges);
      toast("Admin privileges updated", "success");
      const adminList = await listAdmins();
      setAdmins(adminList);
    } catch (err) {
      toast(err.message || "Failed to update privileges", "error");
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    setAdminDeleting(adminId);
    try {
      await deleteAdmin(adminId);
      toast("Admin deleted successfully", "success");
      const adminList = await listAdmins();
      setAdmins(adminList);
    } catch (err) {
      toast(err.message || "Failed to delete admin", "error");
    } finally {
      setAdminDeleting(null);
    }
  };

  const privilegeOptions = [
    {
      id: "manage_products",
      label: "Manage Products",
      description: "Create, edit, delete products",
    },
    {
      id: "manage_orders",
      label: "Manage Orders",
      description: "View and manage orders",
    },
    {
      id: "manage_users",
      label: "Manage Users",
      description: "View and manage users",
    },
    {
      id: "view_analytics",
      label: "View Analytics",
      description: "View dashboard analytics",
    },
  ];

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      category: "",
      basePrice: "",
      finalPrice: "",
      stock: 0,
      images: "",
    });
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setFormModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      basePrice: product.basePrice || "",
      finalPrice: product.finalPrice || "",
      stock: product.stock || 0,
      images: (product.images || []).join(", "),
    });
    setFormModalOpen(true);
  };

  const handleDelete = (product) => {
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast("Product deleted", "success");
      if (editingId === deleteTarget._id) {
        resetForm();
        setFormModalOpen(false);
      }
    } catch (err) {
      toast("Failed to delete product", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      basePrice: Number(form.basePrice) || 0,
      finalPrice: Number(form.finalPrice) || Number(form.basePrice) || 0,
      stock: Number(form.stock) || 0,
      images:
        typeof form.images === "string"
          ? form.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
    };
    try {
      const saved = editingId
        ? await updateProduct(editingId, payload)
        : await createProduct(payload);
      toast(editingId ? "Product updated" : "Product created", "success");
      // refresh list
      const res = await fetchProducts({ limit: 50 });
      setProducts(res.items || res);
      setFormModalOpen(false);
      resetForm();
    } catch (err) {
      toast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async (id) => {
    try {
      await syncProduct(id);
      toast("Price synced", "success");
      const res = await fetchProducts({ limit: 50 });
      setProducts(res.items || res);
    } catch (err) {
      toast("Sync failed", "error");
    }
  };

  const handleWebSearch = async () => {
    if (!form.name) return;
    setSearching(true);
    try {
      const result = await searchProductWeb(form.name);
      setForm((prev) => ({
        ...prev,
        description: result.description || prev.description,
        category: result.category || prev.category,
        basePrice: result.basePrice ?? prev.basePrice,
        finalPrice: result.finalPrice ?? prev.finalPrice,
        images: (result.images || []).join(", "),
      }));
      toast("Loaded details from web", "info");
    } catch (err) {
      toast("No match found on web", "error");
    } finally {
      setSearching(false);
    }
  };

  const stats = useMemo(
    () => ({
      products: products.length,
      orders: orders.length,
      revenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    }),
    [products, orders]
  );

  const margin = useMemo(() => {
    const base = Number(form.basePrice) || 0;
    const final = Number(form.finalPrice) || 0;
    return final - base;
  }, [form.basePrice, form.finalPrice]);

  const filteredProducts = useMemo(() => {
    const term = productQuery.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => (p.name || "").toLowerCase().includes(term));
  }, [products, productQuery]);

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

  const categoryChartData = useMemo(() => {
    const counts = new Map();
    (products || []).forEach((p) => {
      const key = (p.category || "Uncategorized").trim();
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const labels = Array.from(counts.keys());
    const data = Array.from(counts.values());
    return {
      labels,
      datasets: [
        {
          label: "Products",
          data,
          backgroundColor: labels.map((_, i) => {
            const palette = [
              "#a855f7",
              "#e91e63",
              "#22c55e",
              "#3b82f6",
              "#f59e0b",
              "#ef4444",
            ];
            return palette[i % palette.length];
          }),
          borderWidth: 0,
        },
      ],
    };
  }, [products]);

  const orderTrendChartData = useMemo(() => {
    const list = (orders || []).slice(-10);
    const labels = list.map((o, idx) => {
      const ts = o.createdAt ? new Date(o.createdAt) : null;
      return ts ? `${ts.getDate()}/${ts.getMonth() + 1}` : `Order ${idx + 1}`;
    });
    const data = list.map((o) => Number(o.totalAmount || 0));
    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          fill: false,
          borderColor: "#e91e63",
          backgroundColor: "#e91e63",
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    };
  }, [orders]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12 } },
        tooltip: { enabled: true },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "rgba(0,0,0,0.05)" } },
      },
    }),
    []
  );

  const revenueByCategoryChartData = useMemo(() => {
    const productCategoryById = new Map();
    (products || []).forEach((p) => {
      if (p?._id) productCategoryById.set(p._id, p.category || "Unknown");
    });

    const revenueByCat = new Map();
    (orders || []).forEach((o) => {
      (o.items || []).forEach((item) => {
        const id = item?.product?._id || item?.product;
        const cat =
          productCategoryById.get(id) || item?.product?.category || "Unknown";
        const amount = Number(item?.price || 0) * Number(item?.quantity || 0);
        revenueByCat.set(cat, (revenueByCat.get(cat) || 0) + amount);
      });
    });

    const labels = Array.from(revenueByCat.keys());
    const data = Array.from(revenueByCat.values());
    return {
      labels,
      datasets: [
        {
          label: "Revenue (₹)",
          data,
          backgroundColor: labels.map((_, i) => {
            const palette = [
              "#a855f7",
              "#e91e63",
              "#3b82f6",
              "#22c55e",
              "#f59e0b",
              "#ef4444",
            ];
            return palette[i % palette.length];
          }),
          borderRadius: 8,
        },
      ],
    };
  }, [products, orders]);

  return (
    <>
      <PageMeta
        title="Admin Dashboard - PricePulseAI"
        description="Manage your store's products, orders, and admins efficiently with the PricePulseAI Admin Dashboard."
      />
      <section className="min-h-screen px-4 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl"
        >
          <ConfirmModal
            open={!!deleteTarget}
            title="Delete product"
            message={`Delete "${
              deleteTarget?.name || "this product"
            }"? This cannot be undone.`}
            confirmLabel={deleting ? "Deleting..." : "Delete"}
            cancelLabel="Cancel"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            variant="danger"
          />

          <AnimatePresence>
            {formModalOpen && (
              <motion.div
                key="product-form-modal"
                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeFormModal}
                  aria-label="Close product form"
                />

                <motion.div
                  initial={{ y: 40, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 210, damping: 24 }}
                  className="relative z-10 w-full max-w-4xl"
                >
                  <motion.form
                    layout
                    onSubmit={handleSave}
                    className="rounded-2xl p-6 shadow-2xl border"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.98)"
                          : "rgba(10, 10, 10, 0.95)",
                      borderColor:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.08)"
                          : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(155, 89, 182, 0.1)"
                                : "rgba(155, 89, 182, 0.2)",
                          }}
                        >
                          {editingId ? (
                            <Edit3
                              className="w-5 h-5"
                              style={{
                                color:
                                  theme === "light"
                                    ? "var(--primary)"
                                    : "var(--accent)",
                              }}
                            />
                          ) : (
                            <Plus
                              className="w-5 h-5"
                              style={{
                                color:
                                  theme === "light"
                                    ? "var(--primary)"
                                    : "var(--accent)",
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">
                            {editingId ? "Edit Product" : "Create Product"}
                          </h2>
                          {editingId && (
                            <p className="text-sm opacity-70">
                              ID: {editingId.slice(-8)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div
                          className="px-4 py-2 rounded-xl font-semibold"
                          style={{
                            background:
                              margin >= 0
                                ? "rgba(46, 213, 115, 0.15)"
                                : "rgba(231, 76, 60, 0.15)",
                            color: margin >= 0 ? "#2ed573" : "#e74c3c",
                          }}
                        >
                          Margin: ₹{margin.toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={closeFormModal}
                          className="p-2 rounded-lg transition hover:scale-105"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.04)"
                                : "rgba(255, 255, 255, 0.08)",
                          }}
                          aria-label="Close form"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Product Name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Wireless headphones"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Category *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Audio"
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Base Price *
                        </label>
                        <input
                          required
                          type="number"
                          placeholder="1999"
                          value={form.basePrice}
                          onChange={(e) =>
                            setForm({ ...form, basePrice: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Final Price *
                        </label>
                        <input
                          required
                          type="number"
                          placeholder="2099"
                          value={form.finalPrice}
                          onChange={(e) =>
                            setForm({ ...form, finalPrice: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Stock
                        </label>
                        <input
                          type="number"
                          placeholder="50"
                          value={form.stock}
                          onChange={(e) =>
                            setForm({ ...form, stock: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Images (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={form.images}
                          onChange={(e) =>
                            setForm({ ...form, images: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2 opacity-70">
                        Description *
                      </label>
                      <textarea
                        required
                        placeholder="Detailed product description with key features..."
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(255, 255, 255, 0.9)"
                              : "rgba(255, 255, 255, 0.04)",
                          borderColor:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.1)"
                              : "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                        }}
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            {editingId ? (
                              <Edit3 className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                            {editingId ? "Update Product" : "Create Product"}
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleWebSearch}
                        disabled={searching}
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2 border"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(255, 255, 255, 0.9)"
                              : "rgba(255, 255, 255, 0.04)",
                          borderColor:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.1)"
                              : "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {searching ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            Fetch from Web
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={closeFormModal}
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2 border"
                        style={{
                          background: "rgba(231, 76, 60, 0.1)",
                          borderColor: "rgba(231, 76, 60, 0.3)",
                          color: "#e74c3c",
                        }}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Admin Dashboard
              </h1>
            </div>
            <p className="opacity-70">
              Manage your store, products, and orders
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "overview", label: "Overview", icon: LayoutDashboard },
                  { key: "products", label: "Products", icon: Package },
                  { key: "orders", label: "Orders", icon: ShoppingBag },
                  ...(currentUser?.isSuperAdmin
                    ? [{ key: "admins", label: "Admins", icon: Shield }]
                    : []),
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
                    style={{
                      background:
                        tab === key
                          ? "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)"
                          : theme === "light"
                          ? "rgba(255, 255, 255, 0.6)"
                          : "rgba(255, 255, 255, 0.05)",
                      color: tab === key ? "white" : "inherit",
                      border:
                        tab === key
                          ? "none"
                          : theme === "light"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {tab === "products" && (
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                  <input
                    type="search"
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-xl border px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.04)",
                      borderColor:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                    aria-label="Search products by name"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Overview Tab */}
          {tab === "overview" && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-6"
              >
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
                  <div
                    className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                    style={{
                      background: "rgba(52, 152, 219, 0.15)",
                    }}
                  >
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-sm font-semibold opacity-70 mb-2">
                    Total Products
                  </div>
                  <div className="text-3xl font-black mb-2">
                    {stats.products}
                  </div>
                  <div className="text-sm opacity-70">
                    Active SKUs in catalog
                  </div>
                </motion.div>

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
                  <div
                    className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                    style={{
                      background: "rgba(46, 213, 115, 0.15)",
                    }}
                  >
                    <ShoppingBag className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-sm font-semibold opacity-70 mb-2">
                    Total Orders
                  </div>
                  <div className="text-3xl font-black mb-2">{stats.orders}</div>
                  <div className="text-sm opacity-70">Orders placed</div>
                </motion.div>

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
                  <div
                    className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                    style={{
                      background: "rgba(155, 89, 182, 0.15)",
                    }}
                  >
                    <DollarSign
                      className="w-6 h-6"
                      style={{
                        color:
                          theme === "light"
                            ? "var(--primary)"
                            : "var(--accent)",
                      }}
                    />
                  </div>
                  <div className="text-sm font-semibold opacity-70 mb-2">
                    Gross Revenue
                  </div>
                  <div className="text-3xl font-black mb-2">
                    ₹{stats.revenue.toFixed(2)}
                  </div>
                  <div className="text-sm opacity-70">Total earnings</div>
                </motion.div>
              </motion.div>

              {/* Charts */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-6 mt-6"
              >
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
                    height: "320px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: "rgba(233, 30, 99, 0.15)" }}
                    >
                      <TrendingUp className="w-5 h-5 text-pink-500" />
                    </div>
                    <h3 className="text-lg font-bold">Sales Trend (Last 10)</h3>
                  </div>
                  <div style={{ height: "260px" }}>
                    <Line data={orderTrendChartData} options={chartOptions} />
                  </div>
                </motion.div>

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
                    height: "320px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: "rgba(168, 85, 247, 0.15)" }}
                    >
                      <Package className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold">Category Distribution</h3>
                  </div>
                  <div style={{ height: "260px" }}>
                    <Doughnut data={categoryChartData} options={chartOptions} />
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}

          {/* Products Tab */}
          {tab === "products" && (
            <div className="space-y-6">
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
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(155, 89, 182, 0.1)"
                              : "rgba(155, 89, 182, 0.2)",
                        }}
                      >
                        <Package
                          className="w-5 h-5"
                          style={{
                            color:
                              theme === "light"
                                ? "var(--primary)"
                                : "var(--accent)",
                          }}
                        />
                      </div>
                      <h2 className="text-xl font-bold">Products</h2>
                    </div>
                    <p className="opacity-70 text-sm">
                      Use the modal to create or edit SKUs without leaving this
                      view.
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={openCreateModal}
                      className="px-5 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center gap-2"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      New Product
                    </button>
                    <div
                      className="px-4 py-3 rounded-xl text-sm font-semibold"
                      style={{
                        background:
                          margin >= 0
                            ? "rgba(46, 213, 115, 0.15)"
                            : "rgba(231, 76, 60, 0.15)",
                        color: margin >= 0 ? "#2ed573" : "#e74c3c",
                      }}
                    >
                      Draft margin: ₹{margin.toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="md:col-span-2 lg:col-span-3 rounded-2xl p-10 text-center backdrop-blur-xl border border-dashed shadow-sm flex flex-col items-center justify-center gap-3"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.78)"
                          : "rgba(255, 255, 255, 0.05)",
                      borderColor:
                        theme === "light"
                          ? "rgba(155, 89, 182, 0.4)"
                          : "rgba(155, 89, 182, 0.35)",
                      minHeight: "260px",
                    }}
                  >
                    <div
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                      style={{
                        background:
                          theme === "light"
                            ? "rgba(155, 89, 182, 0.12)"
                            : "rgba(155, 89, 182, 0.25)",
                      }}
                    >
                      <Package className="h-8 w-8 opacity-70" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        No products found
                      </h3>
                      <p className="text-sm opacity-70">
                        Adjust your search or create a new product to populate
                        this list.
                      </p>
                    </div>
                  </motion.div>
                )}

                {filteredProducts.map((product) => {
                  const primaryImage = Array.isArray(product.images)
                    ? product.images[0]
                    : product.images;

                  return (
                    <motion.div
                      key={product._id}
                      variants={itemVariants}
                      className="rounded-2xl p-5 backdrop-blur-xl border"
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
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(155, 89, 182, 0.15)"
                                : "rgba(155, 89, 182, 0.2)",
                            color:
                              theme === "light"
                                ? "var(--primary)"
                                : "var(--accent)",
                          }}
                        >
                          {product.category}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{
                              background:
                                theme === "light"
                                  ? "rgba(52, 152, 219, 0.1)"
                                  : "rgba(52, 152, 219, 0.15)",
                            }}
                          >
                            <Edit3 className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{
                              background:
                                deleteTarget?._id === product._id
                                  ? "rgba(239, 68, 68, 0.2)"
                                  : "rgba(231, 76, 60, 0.1)",
                              border:
                                deleteTarget?._id === product._id
                                  ? "1px solid rgba(239, 68, 68, 0.4)"
                                  : "none",
                            }}
                          >
                            <Trash2
                              className="w-4 h-4"
                              style={{
                                color:
                                  deleteTarget?._id === product._id
                                    ? "#ef4444"
                                    : "#ef4444",
                              }}
                            />
                          </button>
                        </div>
                      </div>

                      <div
                        className="relative mb-4 overflow-hidden rounded-xl border aspect-4/3"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.03)"
                              : "rgba(255, 255, 255, 0.03)",
                          borderColor:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.06)"
                              : "rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={`${product.name || "Product"} thumbnail`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center gap-2 text-sm opacity-70">
                            <Box className="w-4 h-4" />
                            No image
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm opacity-70 mb-4 line-clamp-2">
                        {product.description || "No description"}
                      </p>

                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="text-xs opacity-70 mb-1">
                            Final Price
                          </div>
                          <div className="text-xl font-black">
                            ₹{product.finalPrice?.toFixed?.(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-70 mb-1">Stock</div>
                          <div className="font-bold">{product.stock ?? 0}</div>
                        </div>
                      </div>

                      <div
                        className="flex justify-between items-center pt-3 border-t"
                        style={{
                          borderColor:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.1)"
                              : "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <span className="text-xs opacity-70">
                          Base: ₹{product.basePrice?.toFixed?.(2)}
                        </span>
                        <button
                          onClick={() => handleSync(product._id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 flex items-center gap-1 border"
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
                          <RefreshCw className="w-3 h-3" />
                          Sync
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {orders.length === 0 ? (
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
                    <ShoppingBag className="w-12 h-12 opacity-50" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No orders yet</h3>
                  <p className="opacity-70">
                    Orders will appear here once customers start purchasing.
                  </p>
                </motion.div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order._id}
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
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingBag className="w-5 h-5 opacity-70" />
                          <h3 className="font-bold text-lg">
                            Order #{order._id?.slice(-8)}
                          </h3>
                        </div>
                        <p className="text-sm opacity-70">
                          {order.items?.length || 0} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black mb-2">
                          ₹{order.totalAmount?.toFixed?.(2)}
                        </div>
                        <span
                          className="text-xs px-3 py-1.5 rounded-full font-semibold inline-flex items-center gap-1"
                          style={{
                            background:
                              order.paymentStatus === "completed"
                                ? "rgba(46, 213, 115, 0.15)"
                                : order.paymentStatus === "pending"
                                ? "rgba(241, 196, 15, 0.15)"
                                : "rgba(231, 76, 60, 0.15)",
                            color:
                              order.paymentStatus === "completed"
                                ? "#2ed573"
                                : order.paymentStatus === "pending"
                                ? "#f1c40f"
                                : "#e74c3c",
                          }}
                        >
                          {order.paymentStatus === "completed" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : order.paymentStatus === "pending" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {order.paymentStatus || "pending"}
                        </span>
                      </div>
                    </div>

                    <div
                      className="border-t pt-4"
                      style={{
                        borderColor:
                          theme === "light"
                            ? "rgba(0, 0, 0, 0.1)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <h4 className="text-sm font-semibold mb-3 opacity-70">
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 rounded-xl"
                            style={{
                              background:
                                theme === "light"
                                  ? "rgba(0, 0, 0, 0.03)"
                                  : "rgba(255, 255, 255, 0.03)",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Box className="w-4 h-4 opacity-50" />
                              <span className="font-medium">
                                {item.product?.name || "Product"}
                              </span>
                              <span className="text-sm opacity-70">
                                × {item.quantity}
                              </span>
                            </div>
                            <span className="font-bold">
                              ₹{(item.price * (item.quantity || 0)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Admins Tab - Only for SuperAdmins */}
          {tab === "admins" && currentUser?.isSuperAdmin && (
            <div className="space-y-6">
              {/* Header */}
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
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(155, 89, 182, 0.1)"
                              : "rgba(155, 89, 182, 0.2)",
                        }}
                      >
                        <Shield
                          className="w-5 h-5"
                          style={{
                            color:
                              theme === "light"
                                ? "var(--primary)"
                                : "var(--accent)",
                          }}
                        />
                      </div>
                      <h2 className="text-xl font-bold">Admin Management</h2>
                    </div>
                    <p className="opacity-70 text-sm">
                      Create and manage admin accounts with custom privileges
                    </p>
                  </div>

                  <button
                    onClick={openCreateAdminModal}
                    className="px-5 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Admin
                  </button>
                </div>
              </motion.div>

              {/* Admin List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {admins.length === 0 ? (
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl p-10 text-center backdrop-blur-xl border border-dashed flex flex-col items-center justify-center gap-3"
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
                    <Shield className="w-12 h-12 opacity-30" />
                    <h3 className="text-lg font-bold">No admins yet</h3>
                    <p className="opacity-70 max-w-sm">
                      Create your first admin account to get started
                    </p>
                  </motion.div>
                ) : (
                  admins.map((admin) => (
                    <motion.div
                      key={admin._id}
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
                      <div className="mb-4 pb-4 border-b border-current border-opacity-10">
                        <h3 className="text-lg font-bold">{admin.name}</h3>
                        <p className="text-sm opacity-70">{admin.email}</p>
                        {admin.createdAt && (
                          <p className="text-xs opacity-50 mt-1">
                            Created:{" "}
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Privileges Grid */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-3">
                          Privileges:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {privilegeOptions.map((priv) => (
                            <label
                              key={priv.id}
                              className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition hover:bg-opacity-75"
                              style={{
                                background:
                                  theme === "light"
                                    ? "rgba(0, 0, 0, 0.03)"
                                    : "rgba(255, 255, 255, 0.03)",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  admin.privileges?.includes(priv.id) || false
                                }
                                onChange={(e) => {
                                  const newPrivileges = e.target.checked
                                    ? [...(admin.privileges || []), priv.id]
                                    : (admin.privileges || []).filter(
                                        (p) => p !== priv.id
                                      );
                                  handleUpdateAdminPrivileges(
                                    admin._id,
                                    newPrivileges
                                  );
                                }}
                                className="mt-1 w-4 h-4 rounded accent-purple-500"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {priv.label}
                                </p>
                                <p className="text-xs opacity-60">
                                  {priv.description}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        disabled={adminDeleting === admin._id}
                        className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 text-white"
                        style={{
                          background: "rgba(231, 76, 60, 0.8)",
                          opacity: adminDeleting === admin._id ? 0.6 : 1,
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        {adminDeleting === admin._id ? "Deleting..." : "Delete"}
                      </button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          )}

          {/* Admin Form Modal */}
          <AnimatePresence>
            {adminFormOpen && (
              <motion.div
                key="admin-form-modal"
                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeAdminFormModal}
                  aria-label="Close admin form"
                />

                <motion.div
                  initial={{ y: 40, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 210, damping: 24 }}
                  className="relative z-10 w-full max-w-2xl"
                >
                  <motion.form
                    layout
                    onSubmit={handleCreateAdmin}
                    className="rounded-2xl p-6 shadow-2xl border"
                    style={{
                      background:
                        theme === "light"
                          ? "rgba(255, 255, 255, 0.98)"
                          : "rgba(10, 10, 10, 0.95)",
                      borderColor:
                        theme === "light"
                          ? "rgba(0, 0, 0, 0.08)"
                          : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(155, 89, 182, 0.1)"
                                : "rgba(155, 89, 182, 0.2)",
                          }}
                        >
                          <Plus
                            className="w-5 h-5"
                            style={{
                              color:
                                theme === "light"
                                  ? "var(--primary)"
                                  : "var(--accent)",
                            }}
                          />
                        </div>
                        <h2 className="text-xl font-bold">Create New Admin</h2>
                      </div>

                      <button
                        type="button"
                        onClick={closeAdminFormModal}
                        className="p-2 rounded-lg transition hover:scale-105"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.04)"
                              : "rgba(255, 255, 255, 0.08)",
                        }}
                        aria-label="Close form"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="John Doe"
                          value={adminForm.name}
                          onChange={(e) =>
                            setAdminForm({ ...adminForm, name: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="admin@example.com"
                          value={adminForm.email}
                          onChange={(e) =>
                            setAdminForm({
                              ...adminForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 opacity-70">
                          Password *
                        </label>
                        <input
                          required
                          type="password"
                          placeholder="Enter a strong password"
                          value={adminForm.password}
                          onChange={(e) =>
                            setAdminForm({
                              ...adminForm,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{
                            background:
                              theme === "light"
                                ? "rgba(255, 255, 255, 0.9)"
                                : "rgba(255, 255, 255, 0.04)",
                            borderColor:
                              theme === "light"
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                        />
                      </div>

                      {/* Privileges Selection */}
                      <div>
                        <label className="block text-sm font-semibold mb-3 opacity-70">
                          Assign Privileges
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {privilegeOptions.map((priv) => (
                            <label
                              key={priv.id}
                              className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition hover:bg-opacity-75"
                              style={{
                                background:
                                  theme === "light"
                                    ? "rgba(0, 0, 0, 0.03)"
                                    : "rgba(255, 255, 255, 0.03)",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={adminForm.privileges.includes(priv.id)}
                                onChange={(e) => {
                                  const newPrivileges = e.target.checked
                                    ? [...adminForm.privileges, priv.id]
                                    : adminForm.privileges.filter(
                                        (p) => p !== priv.id
                                      );
                                  setAdminForm({
                                    ...adminForm,
                                    privileges: newPrivileges,
                                  });
                                }}
                                className="mt-1 w-4 h-4 rounded accent-purple-500"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {priv.label}
                                </p>
                                <p className="text-xs opacity-60">
                                  {priv.description}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={closeAdminFormModal}
                        className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                        style={{
                          background:
                            theme === "light"
                              ? "rgba(0, 0, 0, 0.08)"
                              : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center gap-2"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--accent) 0%, #e91e63 100%)",
                          opacity: saving ? 0.6 : 1,
                        }}
                      >
                        {saving ? "Creating..." : "Create Admin"}
                      </button>
                    </div>
                  </motion.form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </>
  );
}
