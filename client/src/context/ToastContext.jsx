import { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext({ toast: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const toast = (message, variant = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => remove(id), 3000);
  };

  const value = useMemo(() => ({ toast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100 ,scale: 0.6 }}
              animate={{ opacity: 1, x: 0 , scale: 1 }}
              exit={{ opacity: 0, x: 100 , scale: 0.6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`toast toast-${t.variant}`}
              role="status"
              onClick={() => remove(t.id)}
            >
              <span className="toast-icon" aria-hidden="true">
                {t.variant === "success"
                  ? "✓"
                  : t.variant === "error"
                  ? "✕"
                  : "ℹ"}
              </span>
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
