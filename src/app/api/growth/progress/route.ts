import { json, sameOrigin, sessionEmail } from "@/lib/auth";
import { getGrowth, isModule, saveGrowth } from "@/lib/growth";

/** Tick or untick one step of a module plan. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const email = await sessionEmail();
  if (!email) return json({ error: "Sign in first." }, 401);

  const b = await req.json().catch(() => null);
  const mod = b?.module, step = String(b?.step ?? ""), done = b?.done === true;
  if (!isModule(mod) || !/^s\d{1,2}$/.test(step)) return json({ error: "bad-input" }, 400);

  const doc = await getGrowth(email);
  if (!doc.plans[mod]?.steps.some((s) => s.id === step)) return json({ error: "That step no longer exists. Reload the page." }, 409);
  const set = new Set(doc.done[mod] ?? []);
  if (done) set.add(step); else set.delete(step);
  doc.done[mod] = [...set];
  await saveGrowth(email, doc);
  return json({ ok: true, done: doc.done[mod] });
}
