import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { sendSupportMessage } from "../services/supportService.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const starterPrompts = [
  "Where is my order?",
  "Start a return",
  "Find me a deal",
  "Help with payment",
  "Recommend a laptop",
];

const introMessage = {
  role: "agent",
  content:
    "Hi! I'm your 24/7 PricePulse helper. Ask about orders, returns, payments, or product picks and I'll handle it.",
};

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([introMessage]);
  const [isSending, setIsSending] = useState(false);
  const viewportRef = useRef(null);
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementsByTagName("footer")[0];
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const isBottom = rect.top < window.innerHeight - 100;

      setIsBottom(isBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bubbleColors = useMemo(
    () =>
      theme === "light"
        ? {
            panel: "bg-white/90 border-slate-200",
            user: "bg-emerald-500 text-white",
            agent: "bg-slate-900 text-white",
            accentGradient: "linear-gradient(135deg, #10b981, #0ea5e9)",
            chip: "border-emerald-300/60 text-emerald-700 bg-emerald-50",
          }
        : {
            panel: "bg-slate-900/90 border-slate-800",
            user: "bg-emerald-400 text-slate-900",
            agent: "bg-slate-800 text-white",
            accentGradient: "linear-gradient(135deg, #34d399, #22d3ee)",
            chip: "border-emerald-400/50 text-emerald-100 bg-emerald-500/10",
          },
    [theme]
  );

  useEffect(() => {
    if (!open) return;
    const el = viewportRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async (customText) => {
    if (isSending) return;
    const text = (customText ?? input).trim();
    if (!text) return;

    const history = messages;
    const pending = [...history, { role: "user", content: text }];
    setMessages(pending);
    setInput("");
    setIsSending(true);

    try {
      const data = await sendSupportMessage(text, history);
      const reply = data?.reply || "I couldn't generate a reply just now.";
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: reply, source: data?.source },
      ]);
      if (data?.degraded) {
        toast("Using a backup reply due to heavy load.", "info");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Chat is temporarily unavailable.";
      toast(message, "error");
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            "I'm having trouble replying right now. Try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {!isBottom && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-3 md:right-6 z-60"
        >
          <div className="flex items-center justify-end gap-2 mb-2 pr-1">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Need help?
            </span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col items-end gap-3">
            <AnimatePresence>
              {open && (
                <motion.div
                  key="chat-panel"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`w-[320px] sm:w-90 shadow-2xl rounded-3xl border overflow-hidden ${bubbleColors.panel}`}
                  style={{ backdropFilter: "blur(14px)" }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div>
                      <p className="text-sm font-semibold">PricePulse Help</p>
                      <p className="text-xs text-slate-400">
                        Always-on chat · ~1 min replies
                      </p>
                    </div>
                    <button
                      aria-label="Close chat"
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    ref={viewportRef}
                    className="max-h-90 overflow-y-auto px-4 py-3 space-y-3"
                  >
                    {messages.map((msg, idx) => (
                      <div
                        key={`${msg.role}-${idx}`}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                            msg.role === "user"
                              ? bubbleColors.user
                              : bubbleColors.agent
                          }`}
                          style={{ maxWidth: "85%" }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex justify-start">
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm inline-flex items-center gap-2 ${bubbleColors.agent}`}
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {starterPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          className={`text-xs px-3 py-1 rounded-full transition-all hover:-translate-y-px ${bubbleColors.chip}`}
                          onClick={() => handleSend(prompt)}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-2xl border border-white/20 px-2 py-1.5">
                      <textarea
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about your order or product"
                        className="flex-1 resize-none bg-transparent focus:outline-none text-sm px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleSend()}
                        disabled={isSending}
                        className="p-2 rounded-full bg-linear-to-r text-white shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
                        style={{ backgroundImage: bubbleColors.accentGradient }}
                      >
                        {isSending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-3 shadow-xl rounded-full px-4 py-2 bg-linear-to-r from-slate-900 via-emerald-700 to-emerald-500 text-white"
            >
              <div className="relative">
                <MessageCircle className="w-5 h-5" />
                <span
                  className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-lime-300 animate-pulse"
                  aria-hidden="true"
                ></span>
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs uppercase tracking-[0.2em]">Support</p>
                <p className="text-sm font-semibold">Chat 24/7</p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
