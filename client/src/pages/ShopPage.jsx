import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { loadProducts } from "../redux/slices/productSlice.js";
import { addItem } from "../redux/slices/cartSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import { useRecommendations } from "../hooks/useRecommendations.js";
import { useToast } from "../context/ToastContext.jsx";
import { fetchCategories } from "../services/productService.js";
import PageMeta from "../components/PageMeta.jsx";

export default function ShopPage() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { items: recs, loading: recsLoading } = useRecommendations();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(true);

  // Load products from server with pagination + category filter
  useEffect(() => {
    const params = {
      limit: pageSize,
      page: currentPage,
    };
    if (filter !== "all") {
      params.category = filter;
    }
    if (searchTerm.trim()) {
      params.q = searchTerm.trim();
    }
    dispatch(loadProducts(params));
    // scroll to top on page/filter/search change
    window.scrollTo({ top: 430, behavior: "smooth" });
  }, [dispatch, pageSize, currentPage, filter, searchTerm]);

  // Load category list once
  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((cats) => {
        if (active) setCategories(["all", ...cats]);
      })
      .catch(() => setCategories(["all"]));
    return () => {
      active = false;
    };
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
    setCurrentPage(1);
  }, [searchParams]);

  const clearSearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString());
      next.delete("q");
      return next;
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const displayItems = useMemo(() => {
    let result = items;

    // Sort items
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name-asc") {
      result = [...result].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else if (sortBy === "name-desc") {
      result = [...result].sort((a, b) =>
        (b.name || "").localeCompare(a.name || "")
      );
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Filter by search term
    if (normalizedQuery) {
      const direct = [];
      const related = [];
      for (const p of result) {
        const name = (p.name || "").toLowerCase();
        if (name.includes(normalizedQuery)) {
          direct.push(p);
        } else {
          related.push(p);
        }
      }
      result = [...direct, ...related];
    }

    return result;
  }, [items, normalizedQuery, sortBy]);

  const handleAdd = async (product, quantity = 1) => {
    if (!user) {
      toast("Please login to add items to cart", "warning");
      return;
    }

    try {
      await dispatch(addItem({ productId: product._id, quantity })).unwrap();
      toast(`${product.name} (x${quantity}) added to cart`, "success");
    } catch (err) {
      if (err?.status === 401) {
        toast("Please login to add items to cart", "warning");
      } else {
        toast(err?.message || "Failed to add item to cart", "error");
      }
    }
  };

  return (
    <>
      <PageMeta
        title="Shop Products - PricePulseAI"
        description="Browse and shop a wide range of products on PricePulseAI. Find the best deals and latest arrivals."
      />
      <div
        className="w-full"
      >
        <section className="w-full px-4 pb-24 pt-52 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 via-transparent to-purple-500/10" />
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm mb-4 backdrop-blur-sm">
              <span className="text-blue-400">🛍️</span>
              Shop everything
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Browse our{" "}
              <span className="bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                catalog
              </span>
            </h1>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              Filter by category and discover best-sellers plus AI-powered
              picks.
            </p>
          </div>
        </section>

        <section className="px-4 py-20 relative" 
        style={{ background: "var(--page-bg)", color: "var(--text)" }}>
          <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 via-transparent to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Filter Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm mb-3 backdrop-blur-sm">
                <span className="text-blue-400">🎯</span>
                Filter & Sort
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Latest arrivals</h2>
                  <p className="text-base opacity-60 mt-1">
                    {total > 0 && `${total} products available`}
                  </p>
                </div>
                <motion.button
                  type="button"
                  className="md:hidden rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </motion.button>
              </div>
            </div>

            {/* Professional Filter Controls */}
            <motion.div
              className={`mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden ${
                !showFilters ? "hidden md:block" : ""
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                {/* Search and Sort Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  {/* Search Input */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold mb-2 opacity-80">
                      Search Products
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 pl-10 text-sm backdrop-blur-sm transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg opacity-50">
                        🔍
                      </span>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-60 hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sort Selector */}
                  <div>
                    <label
                      htmlFor="sort-select"
                      className="block text-sm font-semibold mb-2 opacity-80"
                    >
                      Sort By
                    </label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm backdrop-blur-sm transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                      <option
                        value="default"
                        style={{ background: "#0b1220", color: "#e5e7eb" }}
                      >
                        Default
                      </option>
                      <option
                        value="price-low"
                        style={{ background: "#0b1220", color: "#e5e7eb" }}
                      >
                        Price: Low to High
                      </option>
                      <option
                        value="price-high"
                        style={{ background: "#0b1220", color: "#e5e7eb" }}
                      >
                        Price: High to Low
                      </option>
                      <option
                        value="name-asc"
                        style={{ background: "#0b1220", color: "#e5e7eb" }}
                      >
                        Name: A to Z
                      </option>
                      <option
                        value="name-desc"
                        style={{ background: "#0b1220", color: "#e5e7eb" }}
                      >
                        Name: Z to A
                      </option>
                      <option
                        value="rating"
                        style={{ background: "#0b1220", color: "#e5e7eb" }}
                      >
                        Highest Rated
                      </option>
                    </select>
                  </div>
                </div>

                {/* Category Filters */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold opacity-80">
                      Categories
                    </label>
                    {filter !== "all" && (
                      <button
                        type="button"
                        onClick={() => setFilter("all")}
                        className="text-xs font-semibold opacity-60 hover:opacity-100 transition"
                        style={{ color: "var(--accent)" }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat}
                        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                          filter === cat
                            ? "shadow-lg"
                            : "border-white/10 hover:bg-white/5"
                        }`}
                        style={
                          filter === cat
                            ? {
                                borderColor: "var(--accent)",
                                color: "var(--accent)",
                                background: "rgba(139, 92, 246, 0.15)",
                              }
                            : undefined
                        }
                        onClick={() => setFilter(cat)}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {cat === "all"
                          ? "All Products"
                          : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {(filter !== "all" ||
                  searchTerm.trim() ||
                  sortBy !== "default") && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                          Active:
                        </span>
                        {filter !== "all" && (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium">
                            {filter}
                          </span>
                        )}
                        {searchTerm.trim() && (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-medium">
                            Search: "{searchTerm.trim()}"
                          </span>
                        )}
                        {sortBy !== "default" && (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-xs font-medium">
                            Sorted
                          </span>
                        )}
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => {
                          setFilter("all");
                          setSortBy("default");
                          clearSearch();
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/5 transition"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Reset All
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex flex-wrap items-center justify-between gap-6 mb-12"></div>

            <motion.div
              className="mb-6 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold opacity-90">Products</h3>
              <div className="flex items-center gap-2 text-sm opacity-60">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                Updated hourly
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {displayItems.map((product, idx) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAdd={handleAdd}
                  index={idx}
                />
              ))}
            </motion.div>

            {/* Empty state when no items */}
            {displayItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-10"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur-lg shadow-xl">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-blue-500/10" />
                  <div className="absolute -top-8 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
                  <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

                  <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm mb-4">
                    <span>🔍</span>
                    No products found
                  </div>

                  <h4 className="relative text-2xl font-bold mb-2">
                    Nothing to show here
                  </h4>
                  <p className="relative opacity-75 max-w-md mx-auto">
                    We couldn't find matches for your current filters.
                  </p>

                  {(filter !== "all" || searchTerm.trim()) && (
                    <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2 text-sm opacity-85">
                      {searchTerm.trim() && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                          <span className="text-xs uppercase tracking-wide opacity-70">
                            Search
                          </span>
                          <span className="font-mono">{searchTerm.trim()}</span>
                        </span>
                      )}
                      {filter !== "all" && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                          <span className="text-xs uppercase tracking-wide opacity-70">
                            Category
                          </span>
                          <span className="font-semibold">{filter}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
                    <motion.button
                      type="button"
                      className="rounded-full border px-5 py-2.5 font-semibold"
                      onClick={() => setFilter("all")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        borderColor: "var(--accent)",
                        color: "var(--accent)",
                      }}
                    >
                      Reset Filters
                    </motion.button>

                    {searchTerm.trim() && (
                      <motion.button
                        type="button"
                        className="rounded-full border px-5 py-2.5 font-semibold"
                        onClick={clearSearch}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          borderColor: "var(--accent)",
                          color: "var(--accent)",
                        }}
                      >
                        Clear Search
                      </motion.button>
                    )}

                    {(filter !== "all" || searchTerm.trim()) && (
                      <motion.button
                        type="button"
                        className="rounded-full border px-5 py-2.5 font-semibold"
                        onClick={() => {
                          setFilter("all");
                          setSearchParams((prev) => {
                            const next = new URLSearchParams(prev.toString());
                            next.delete("q");
                            return next;
                          });
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          borderColor: "var(--accent)",
                          color: "var(--accent)",
                        }}
                      >
                        Show all products
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-70">Page</span>
                  <span className="text-sm font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      opacity: currentPage === 1 ? 0.5 : 1,
                      borderColor: "var(--accent)",
                    }}
                  >
                    Prev
                  </motion.button>

                  {/* Page numbers (compact) */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    const active = page === currentPage;
                    return (
                      <motion.button
                        key={page}
                        type="button"
                        className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                          active ? "shadow-lg" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={
                          active
                            ? {
                                borderColor: "var(--accent)",
                                color: "var(--accent)",
                                background: "rgba(139, 92, 246, 0.12)",
                              }
                            : undefined
                        }
                      >
                        {page}
                      </motion.button>
                    );
                  })}

                  <motion.button
                    type="button"
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      borderColor: "var(--accent)",
                    }}
                  >
                    Next
                  </motion.button>
                </div>

                {/* Page size selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-70">Per page</span>
                  <select
                    id="page-size"
                    className="rounded-full border px-3 py-2 text-sm font-semibold"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ borderColor: "var(--accent)" }}
                  >
                    {[6, 12, 18, 24].map((n) => (
                      <option
                        key={n}
                        value={n}
                        style={{
                          border: "1px solid #ff7b5f",
                          background: "#0b1220",
                          color: "#e5e7eb",
                        }}
                      >
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="px-4 py-24 relative">
          <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 via-transparent to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm mb-3 backdrop-blur-sm">
                  <span className="text-purple-400">🤖</span>
                  AI Recommended
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  Tailored{" "}
                  <span className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    picks for you
                  </span>
                </h3>
                <p className="text-base opacity-60">
                  Powered by browsing signals and trending searches.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <span className="text-pink-400">✨</span>
                AI picks
              </span>
            </div>

            {recsLoading ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-lg bg-linear-to-br from-white/5 to-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : recs.length > 0 ? (
              <motion.div
                className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {recs.map((product, idx) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAdd={handleAdd}
                    index={idx}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <p className="opacity-70">
                  No recommendations available at this time.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
