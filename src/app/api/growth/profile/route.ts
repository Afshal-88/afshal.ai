import { json, limited, sameOrigin, sessionEmail } from "@/lib/auth";
import { getGrowth, readProfile, saveGrowth } from "@/lib/growth";

/** Save the business profile the AI plans are built from. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const email = await sessionEmail();
  if (!email) return json({ error: "Sign in first." }, 401);
  if (limited(req, "growth-profile", 20, 60 * 60 * 1000)) return json({ error: "Too many saves. Try again in a while." }, 429);

  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return json({ error: "Could not read the form." }, 400);
  const profile = readProfile(b as Record<string, unknown>);
  if (typeof profile === "string") return json({ error: profile }, 400);

  const doc = await getGrowth(email);
  doc.profile = profile;
  await saveGrowth(email, doc);
  return json({ ok: true, profile });
}
