import { json, sessionEmail } from "@/lib/auth";
import { DAILY_GENERATIONS, getGrowth } from "@/lib/growth";

/** The signed-in user's Growth Plan: profile, module plans and ticked steps. */
export async function GET() {
  const email = await sessionEmail();
  if (!email) return json({ error: "signin" }, 401);
  const doc = await getGrowth(email);
  const today = new Date().toISOString().slice(0, 10);
  const used = doc.gens.day === today ? doc.gens.count : 0;
  return json({ profile: doc.profile, plans: doc.plans, done: doc.done, left: Math.max(0, DAILY_GENERATIONS - used) });
}
