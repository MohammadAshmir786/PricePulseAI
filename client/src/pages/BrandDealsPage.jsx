import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp, Tag, Zap } from "lucide-react";
import PageMeta from "../components/PageMeta.jsx";

export default function BrandDealsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const deals = [
    {
      id: 1,
      platform: "amazon",
      title:
        "Ponds Bright Beauty Anti-Dullness & Brightening Facewash with Niacinamide | For Glass-Skin Like Shine and with 4X Visibly Brighter Skin, 200gm",
      brand: "POND'S",
      originalPrice: 349,
      dealPrice: 213,
      discount: 39,
      image: "https://m.media-amazon.com/images/I/512dChFNuXL._SX679_.jpg",
      url: "https://amzn.to/3KZiOjy",
      category: "beauty",
      rating: 4.5,
      reviews: 2348,
    },
    {
      id: 2,
      platform: "flipkart",
      title:
        "POND's Bright Beauty Infused with vitamin B3 & Niacinamide for Anti Dullness & glass skin shine Face Wash  (200 g)",
      brand: "POND'S",
      originalPrice: 425,
      dealPrice: 214,
      discount: 49,
      image: "https://m.media-amazon.com/images/I/512dChFNuXL._SX679_.jpg",
      url: "https://fktr.in/902oxSG",
      category: "beauty",
      rating: 4.4,
      reviews: 9548,
    },
    {
      id: 3,
      platform: "amazon",
      title: "Mechanical Gaming Keyboard RGB",
      brand: "Logitech",
      originalPrice: 8999,
      dealPrice: 5999,
      discount: 33,
      image:
        "https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=500&h=500&fit=crop",
      url: "https://amazon.in",
      category: "Peripherals",
      rating: 4.7,
      reviews: 892,
    },
    {
      id: 4,
      platform: "flipkart",
      title: "Portable Power Bank 20000mAh",
      brand: "Mi",
      originalPrice: 2999,
      dealPrice: 1799,
      discount: 40,
      image:
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
      url: "https://flipkart.com",
      category: "Power",
      rating: 4.4,
      reviews: 3421,
    },
    {
      id: 5,
      platform: "amazon",
      title: "4K Ultra HD Webcam",
      brand: "Razer",
      originalPrice: 5999,
      dealPrice: 3999,
      discount: 33,
      image:
        "https://images.unsplash.com/photo-1598611438281-92b59f8f6b51?w=500&h=500&fit=crop",
      url: "https://amazon.in",
      category: "Electronics",
      rating: 4.6,
      reviews: 687,
    },
    {
      id: 6,
      platform: "flipkart",
      title: "Wireless Gaming Mouse",
      brand: "HP",
      originalPrice: 2499,
      dealPrice: 1299,
      discount: 48,
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
      url: "https://flipkart.com",
      category: "Peripherals",
      rating: 4.2,
      reviews: 1234,
    },
  ];

  const filteredDeals =
    activeTab === "all"
      ? deals
      : deals.filter((deal) => deal.platform === activeTab);

  const platformLogos = {
    amazon: {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      color: "#FF9900",
      bgColor: "rgba(255, 153, 0, 0.1)",
    },
    flipkart: {
      name: "Flipkart",
      logo: "https://www.svgrepo.com/show/303315/flipkart-logo.svg",
      color: "#2874F0",
      bgColor: "rgba(40, 116, 240, 0.1)",
    },
  };

  return (
    <>
      <PageMeta
        title="Brand Deals - PricePulseAI"
        description="Discover the best brand deals from Amazon and Flipkart on PricePulseAI. Save big on top products with exclusive discounts."
      />
      <div
        style={{
          backgroundColor: "var(--bg)",
          minHeight: "100vh",
          paddingTop: "6rem",
        }}
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1rem" }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255, 123, 95, 0.1)",
                border: "1px solid rgba(255, 123, 95, 0.3)",
                borderRadius: "999px",
                padding: "0.5rem 1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <TrendingUp
                style={{ width: 18, height: 18, color: "var(--accent)" }}
              />
              <span
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                Hot Deals from Top Brands
              </span>
            </div>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                color: "var(--text)",
                marginBottom: "1rem",
                background:
                  "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Brand Highlights
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--muted)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Curated deals from Amazon & Flipkart. Compare prices and grab the
              best offers on premium products.
            </p>
          </motion.div>

          {/* Platform Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "3rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setActiveTab("all")}
              className="glass"
              style={{
                padding: "0.875rem 2rem",
                borderRadius: "12px",
                border:
                  activeTab === "all"
                    ? "2px solid var(--accent)"
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  activeTab === "all"
                    ? "rgba(255, 123, 95, 0.1)"
                    : "rgba(255,255,255,0.05)",
                color: activeTab === "all" ? "var(--accent)" : "var(--text)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              All Deals
            </button>
            <button
              onClick={() => setActiveTab("amazon")}
              className="glass"
              style={{
                padding: "0.875rem 2rem",
                borderRadius: "12px",
                border:
                  activeTab === "amazon"
                    ? `2px solid ${platformLogos.amazon.color}`
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  activeTab === "amazon"
                    ? platformLogos.amazon.bgColor
                    : "rgba(255,255,255,0.05)",
                color:
                  activeTab === "amazon"
                    ? platformLogos.amazon.color
                    : "var(--text)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <img
                src={platformLogos.amazon.logo}
                alt="Amazon"
                style={{
                  height: "18px",
                  filter:
                    activeTab !== "amazon"
                      ? "grayscale(1) opacity(0.5)"
                      : "none",
                }}
              />
              Amazon
            </button>
            <button
              onClick={() => setActiveTab("flipkart")}
              className="glass"
              style={{
                padding: "0.875rem 2rem",
                borderRadius: "12px",
                border:
                  activeTab === "flipkart"
                    ? `2px solid ${platformLogos.flipkart.color}`
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  activeTab === "flipkart"
                    ? platformLogos.flipkart.bgColor
                    : "rgba(255,255,255,0.05)",
                color:
                  activeTab === "flipkart"
                    ? platformLogos.flipkart.color
                    : "var(--text)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <img
                src={platformLogos.flipkart.logo}
                alt="Flipkart"
                style={{
                  height: "18px",
                  filter:
                    activeTab !== "flipkart"
                      ? "grayscale(1) opacity(0.5)"
                      : "none",
                }}
              />
              Flipkart
            </button>
          </motion.div>

          {/* Deals Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.3s",
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Platform Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    zIndex: 10,
                    background: platformLogos[deal.platform].bgColor,
                    border: `1px solid ${platformLogos[deal.platform].color}40`,
                    borderRadius: "8px",
                    padding: "0.375rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={platformLogos[deal.platform].logo}
                    alt={platformLogos[deal.platform].name}
                    style={{ height: "14px" }}
                  />
                </div>

                {/* Discount Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    zIndex: 10,
                    background: "var(--accent)",
                    borderRadius: "8px",
                    padding: "0.375rem 0.75rem",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#041017",
                  }}
                >
                  {deal.discount}% OFF
                </div>

                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={deal.image}
                    alt={deal.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {deal.category}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {deal.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--muted)",
                      marginBottom: "1rem",
                    }}
                  >
                    by {deal.brand}
                  </p>

                  {/* Rating */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.125rem" }}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color:
                              i < Math.floor(deal.rating)
                                ? "var(--accent)"
                                : "rgba(255,255,255,0.2)",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span
                      style={{ fontSize: "0.875rem", color: "var(--muted)" }}
                    >
                      ({deal.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.75rem",
                          fontWeight: 800,
                          color: "var(--text)",
                        }}
                      >
                        ₹{deal.dealPrice.toLocaleString()}
                      </span>
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "var(--muted)",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{deal.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--accent)",
                        marginTop: "0.25rem",
                      }}
                    >
                      You save ₹
                      {(deal.originalPrice - deal.dealPrice).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <a
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.875rem",
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textDecoration: "none",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <ExternalLink style={{ width: 16, height: 16 }} />
                      View Deal
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass"
            style={{
              marginTop: "3rem",
              padding: "2rem",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <Zap
              style={{
                width: 32,
                height: 32,
                color: "var(--accent)",
                margin: "0 auto 1rem",
              }}
            />
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "0.5rem",
              }}
            >
              Prices Update in Real-Time
            </h3>
            <p
              style={{
                color: "var(--muted)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Our AI continuously monitors deals from Amazon and Flipkart to
              bring you the best prices. Deals shown are live and subject to
              availability.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
