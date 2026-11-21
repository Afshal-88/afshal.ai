import { json, limited, sameOrigin } from "@/lib/auth";
import { fetchSafe, metaContent, readCapped, safeUrl } from "@/lib/safe-fetch";
import type { SiteSeen } from "@/data/plans";

const SOCIAL: [string, RegExp][] = [
  ["Instagram", /instagram\.com\//i], ["Facebook", /facebook\.com\//i], ["TikTok", /tiktok\.com\//i],
  ["LinkedIn", /linkedin\.com\//i], ["YouTube", /youtube\.com\//i], ["WhatsApp", /(wa\.me|api\.whatsapp\.com)\//i],
];

/** Looks at a brand's website for the plan quiz: what's there, what's missing. Facts only, no scores. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (limited(req, "peek", 12, 60 * 60 * 1000)) return json({ error: "Too many checks. Try again later." }, 429);
  const raw = String((await req.json().catch(() => ({})))?.url ?? "").trim().slice(0, 200);
  let url: URL;
  try { url = await safeUrl(raw); } catch { return json({ error: "We couldn't open that address. Check it, or skip this step." }, 400); }
  const t0 = performance.now();
  let res: Response, final: URL;
  try { ({ res, url: final } = await fetchSafe(url, 12000)); } catch { return json({ error: "That website didn't answer. You can skip this step." }, 502); }
  const ms = Math.round(performance.now() - t0);
  const { text: html } = await readCapped(res);
  const links = (html.match(/href\s*=\s*["'][^"']+["']/gi) ?? []).join(" ");

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim().slice(0, 90) ?? "";
  const desc = metaContent(html, "description") ?? "";
  const mobile = /width\s*=\s*device-width/i.test(metaContent(html, "viewport") ?? "");
  const https = final.protocol === "https:";
  const og = !!metaContent(html, "og:image");
  const h1 = (html.match(/<h1\b/gi) ?? []).length;
  const socials = SOCIAL.filter(([, r]) => r.test(links)).map(([n]) => n);

  const issues: string[] = [], good: string[] = [];
  (https ? good : issues).push(https ? "Secure (https)" : "Not secure: no https padlock");
  (mobile ? good : issues).push(mobile ? "Set up for phones" : "Not set up for phones");
  (ms < 1500 ? good : issues).push(ms < 1500 ? "Answers quickly" : `Slow to answer (${(ms / 1000).toFixed(1)}s)`);
  (desc ? good : issues).push(desc ? "Has a Google description" : "No description for Google results");
  if (h1 !== 1) issues.push(h1 === 0 ? "No main heading for Google" : "Several main headings confuse Google");
  if (!og) issues.push("Links shared on WhatsApp show no preview image");
  if (!socials.includes("WhatsApp")) issues.push("No WhatsApp button");
  if (res.status >= 400) issues.unshift(`Page returns an error (${res.status})`);

  const seen: SiteSeen = { url: final.toString(), title, ok: res.status < 400, issues: issues.slice(0, 5), good, socials: socials.filter((s) => s !== "WhatsApp") };
  return json(seen);
}
