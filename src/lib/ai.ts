import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * The model every AI feature uses.
 * - If GOOGLE_GENERATIVE_AI_API_KEY is set (a free key from Google AI Studio), calls Gemini directly.
 *   Free-tier Gemini needs no credit card; rate limits are shown in AI Studio.
 * - Otherwise falls back to Vercel AI Gateway, which needs a card on file in Vercel.
 * GEMINI_MODEL can override the Gemini model id without a code change.
 */
export function aiModel() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (key) return createGoogleGenerativeAI({ apiKey: key })(process.env.GEMINI_MODEL || "gemini-2.5-flash");
  return "anthropic/claude-haiku-5.5";
}

/** Gemini "thinks" by default, which eats the output budget on short tasks; keep it off. */
export const aiOptions = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ? { providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } } }
  : {};
