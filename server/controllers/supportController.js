import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const systemPrompt = `You are PricePulse AI's always-on support concierge. Answer clearly and concisely. If you do not know, say so briefly and suggest a next step. Keep replies under 120 words. When relevant, guide users to track orders, manage returns, payments, wishlist, pricing alerts, deals, and account security. Avoid hallucinations and avoid URLs unless provided.`;

const quickAnswers = [
  {
    keywords: ["return", "refund", "exchange"],
    reply:
      "You can request a return or refund from your orders within the return window. Go to Profile → Orders, select the item, and choose Return/Refund. If a label is needed, we'll email it."
  },
  {
    keywords: ["shipping", "delivery", "track"],
    reply:
      "Shipping updates are in Profile → Orders. Pick your order to see live tracking. If tracking stalls 48h, I can escalate with the carrier for you."
  },
  {
    keywords: ["payment", "card", "charged", "billing"],
    reply:
      "For payment or billing questions, check your recent charges under Profile → Payments. If a charge looks wrong, freeze the card in your bank app and tell me the order number to investigate."
  },
  {
    keywords: ["price", "deal", "discount", "alert"],
    reply:
      "I can watch prices for you. Add the product to your wishlist and enable alerts. We'll notify you when the price drops or a coupon applies."
  },
  {
    keywords: ["account", "password", "login", "otp", "email"],
    reply:
      "If you're locked out, use Forgot Password on the login page to get a one-time code by email. For account security issues, I recommend changing the password and reviewing recent logins."
  }
];

function buildFallbackReply(message = "") {
  const lower = message.toLowerCase();
  const match = quickAnswers.find((item) => item.keywords.some((k) => lower.includes(k)));
  if (match) return match.reply;
  return "I'm here 24/7 to help with orders, returns, payments, and product guidance. Share what you need and I'll take the next step.";
}

export const chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body || {};
  const trimmed = message?.trim();
  if (!trimmed) {
    throw new AppError("Message is required", 400);
  }

  const groqKey = process.env.GROQ_API_KEY;
  const normalizedHistory = Array.isArray(history)
    ? history.slice(-8).map((turn) => ({
      role: turn.role === "agent" ? "assistant" : "user",
      content: turn.content || ""
    }))
    : [];

  if (!groqKey) {
    return res.json({ reply: buildFallbackReply(trimmed), source: "fallback" });
  }

  const payload = {
    model: "llama-3.1-8b-instant",
    temperature: 0.4,
    max_tokens: 400,
    messages: [
      { role: "system", content: systemPrompt },
      ...normalizedHistory,
      { role: "user", content: trimmed }
    ]
  };

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const reply = response?.data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("Empty completion");
    }

    return res.json({ reply, source: "groq" });
  } catch (err) {
    console.error("Support chat error", err?.response?.data || err.message);
    return res.json({ reply: buildFallbackReply(trimmed), source: "fallback", degraded: true });
  }
});
