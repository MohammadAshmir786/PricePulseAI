import { motion } from "framer-motion";

export default function PriceBadge({ price, base }) {
  const validPrice = typeof price === "number" && !Number.isNaN(price);
  const validBase = typeof base === "number" && !Number.isNaN(base);

  const saving = validBase && validPrice ? Math.max(base - price, 0) : 0;
  const savingPct =
    validBase && validPrice && base > 0
      ? Math.max(((base - price) / base) * 100, 0)
      : null;

  return (
    <motion.div
      className="rounded-lg px-3 py-2.5 space-y-1"
      style={{
        background: "rgba(255, 107, 74, 0.12)",
        border: "1px solid rgba(255, 107, 74, 0.3)",
        backdropFilter: "blur(8px)",
      }}
      aria-label={
        validPrice ? `AI price ₹${price.toFixed(2)}` : "AI price unavailable"
      }
      whileHover={{
        scale: 1.05,
        background: "rgba(255, 107, 74, 0.18)",
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-[10px] font-semibold tracking-wider opacity-80">
        🤖 AI
      </div>
      <div className="text-lg font-bold" style={{ color: "var(--accent)" }}>
        ₹{validPrice ? price.toFixed(0) : "--"}
      </div>
      {saving > 0 && (
        <motion.div
          className="text-[10px] font-semibold"
          style={{ color: "var(--accent)" }}
          whileHover={{ scale: 1.02 }}
        >
          ↓{" "}
          {savingPct !== null
            ? `${savingPct.toFixed(0)}%`
            : `₹${saving.toFixed(0)}`}
        </motion.div>
      )}
    </motion.div>
  );
}
