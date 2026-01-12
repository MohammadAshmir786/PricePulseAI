import PropTypes from "prop-types";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) {
  if (!open) return null;

  const accent = variant === "danger" ? "#ef4444" : "var(--accent)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div className="px-6 py-5 space-y-3">
          <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {message}
          </p>
        </div>
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-semibold border"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "var(--text)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg font-semibold text-white"
            style={{
              background: accent,
              boxShadow: "0 10px 30px rgba(239,68,68,0.3)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["danger", "default"]),
};
