import { randomBytes } from "node:crypto";
import { json, limited, sameOrigin, validEmail } from "@/lib/auth";
import { clean, type AuditRequest } from "@/lib/hub";
import { putJSON } from "@/lib/store";
import { solutions } from "@/data/ai-solutions";

const KEYS = new Set<string>(solutions.map((s) => s.key));

/** Free AI audit request from /ai-solutions. Stored for the admin panel; no account needed. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (limited(req, "audit", 4, 60 * 60 * 1000)) return json({ error: "Too many requests. Message us on WhatsApp instead." }, 429);
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return json({ error: "Could not read the form." }, 400);
  if (clean(b.website, 200)) return json({ ok: true }); // honeypot: bots fill hidden fields

  const name = clean(b.name, 80), business = clean(b.business, 160), problem = clean(b.problem, 1200);
  const whatsapp = clean(b.whatsapp, 20).replace(/[^\d+]/g, "");
  const email = clean(b.email, 120).toLowerCase();
  const interests = (Array.isArray(b.interests) ? b.interests : []).map((x: unknown) => clean(x, 20)).filter((k: string) => KEYS.has(k)).slice(0, 6);

  if (name.length < 2) return json({ error: "Enter your name." }, 400);
  if (whatsapp.replace(/\D/g, "").length < 10) return json({ error: "Enter your WhatsApp number with country or city code." }, 400);
  if (business.length < 2) return json({ error: "Tell us your business name and what it does." }, 400);
  if (email && !validEmail(email)) return json({ error: "That email doesn't look right. Fix it or leave it empty." }, 400);
  if (problem.length < 10) return json({ error: "Tell us a little more about what takes up your time." }, 400);

  const id = `${Date.now().toString(36)}${randomBytes(3).toString("hex")}`;
  const a: AuditRequest = { id, name, business, whatsapp, email, interests, problem, createdAt: new Date().toISOString() };
  await putJSON(`audits/${id}.json`, a, false);
  return json({ ok: true });
}
