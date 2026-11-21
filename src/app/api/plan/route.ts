import { randomBytes } from "node:crypto";
import { json, limited, sameOrigin, validEmail } from "@/lib/auth";
import { clean } from "@/lib/hub";
import { putJSON } from "@/lib/store";
import { buildPlans, questions, type Answers, type PlanRequest } from "@/data/plans";

const allowed = new Map(questions.filter((q) => q.options).map((q) => [q.key, new Set(q.options!.map((o) => o.value))]));

/** Saves a finished plan quiz for the admin panel. No account needed. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (limited(req, "plan", 5, 60 * 60 * 1000)) return json({ error: "Too many requests. Message us on WhatsApp instead." }, 429);
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return json({ error: "Could not read the form." }, 400);
  if (clean(b.company, 100)) return json({ ok: true }); // honeypot

  const name = clean(b.name, 80), business = clean(b.business, 120);
  const whatsapp = clean(b.whatsapp, 20).replace(/[^\d+]/g, "");
  const email = clean(b.email, 120).toLowerCase();
  if (name.length < 2) return json({ error: "Enter your name." }, 400);
  if (whatsapp.replace(/\D/g, "").length < 10) return json({ error: "Enter your WhatsApp number with country or city code." }, 400);
  if (email && !validEmail(email)) return json({ error: "That email doesn't look right. Fix it or leave it empty." }, 400);

  const raw = (b.answers ?? {}) as Record<string, unknown>;
  const answers: Answers = {};
  for (const [k, set] of allowed) {
    const v = raw[k];
    if (Array.isArray(v)) (answers as Record<string, unknown>)[k] = v.map((x) => clean(x, 20)).filter((x) => set.has(x)).slice(0, 8);
    else if (typeof v === "string" && set.has(v)) (answers as Record<string, unknown>)[k] = v;
  }
  answers.website = clean(raw.website, 200);
  answers.social = clean(raw.social, 120);

  const plans = buildPlans(answers);
  const rec = plans.find((p) => p.recommended) ?? plans[0];
  const id = `${Date.now().toString(36)}${randomBytes(3).toString("hex")}`;
  const p: PlanRequest = {
    id, name, business: business || "(not given)", whatsapp, email, answers, recommended: rec.name,
    summary: [`${rec.name}: $${rec.setup} setup + $${rec.monthly}/month`, ...rec.setupItems.slice(0, 2)],
    createdAt: new Date().toISOString(),
  };
  await putJSON(`plans/${id}.json`, p, false);
  return json({ ok: true });
}
