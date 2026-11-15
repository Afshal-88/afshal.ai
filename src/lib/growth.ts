import { clean } from "./hub";
import { emailKey } from "./auth";
import { getJSON, putJSON } from "./store";
import { businessTypes, goals, languages, moduleKeys, type ModuleKey } from "@/data/growth";

export type GrowthProfile = {
  business: string;
  type: string;
  city: string;
  offer: string;
  audience: string;
  goals: string[];
  website: string;
  socials: string;
  budget: string;
  language: "english" | "roman-urdu";
  updatedAt: string;
};

export type Step = { id: string; title: string; detail: string; tool: string; time: string };
export type ModulePlan = { steps: Step[]; createdAt: string };

export type GrowthDoc = {
  profile: GrowthProfile | null;
  plans: Partial<Record<ModuleKey, ModulePlan>>;
  done: Partial<Record<ModuleKey, string[]>>;
  gens: { day: string; count: number };
};

/** AI plans a user can create per day. Keeps AI cost predictable. */
export const DAILY_GENERATIONS = 10;

const path = (email: string) => `growth/${emailKey(email)}.json`;
const empty = (): GrowthDoc => ({ profile: null, plans: {}, done: {}, gens: { day: "", count: 0 } });

export async function getGrowth(email: string): Promise<GrowthDoc> {
  return { ...empty(), ...((await getJSON<Partial<GrowthDoc>>(path(email))) ?? {}) };
}
export async function saveGrowth(email: string, doc: GrowthDoc) {
  await putJSON(path(email), doc);
}

export const isModule = (k: unknown): k is ModuleKey => typeof k === "string" && (moduleKeys as string[]).includes(k);

/** Validate a profile from the form. Returns an error message or the clean profile. */
export function readProfile(b: Record<string, unknown>): string | GrowthProfile {
  const business = clean(b.business, 120);
  const type = clean(b.type, 80);
  const city = clean(b.city, 80);
  const offer = clean(b.offer, 500);
  const audience = clean(b.audience, 400);
  const website = clean(b.website, 200);
  const socials = clean(b.socials, 300);
  const budget = clean(b.budget, 120);
  const lang = clean(b.language, 20);
  const g = (Array.isArray(b.goals) ? b.goals : []).map((x) => clean(x, 80)).filter((x) => goals.includes(x)).slice(0, 6);

  if (business.length < 2) return "Enter your business name.";
  if (!businessTypes.includes(type)) return "Choose what kind of business it is.";
  if (city.length < 2) return "Enter your city.";
  if (offer.length < 10) return "Tell us what you sell, in a sentence or two.";
  if (audience.length < 5) return "Tell us who your customers are.";
  if (!g.length) return "Pick at least one goal.";

  return {
    business, type, city, offer, audience, goals: g, website, socials, budget,
    language: languages.some((l) => l.key === lang) ? (lang as GrowthProfile["language"]) : "english",
    updatedAt: new Date().toISOString(),
  };
}

/** Parse the model's JSON reply into clean steps. Returns null if it isn't usable. */
export function parseSteps(text: string): Step[] | null {
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  let data: unknown;
  try { data = JSON.parse(text.slice(start, end + 1)); } catch { return null; }
  const raw = (data as { steps?: unknown })?.steps;
  if (!Array.isArray(raw)) return null;
  const steps = raw.slice(0, 12).map((s, i) => {
    const o = (s ?? {}) as Record<string, unknown>;
    return {
      id: `s${i + 1}`,
      title: clean(o.title, 140),
      detail: String(o.detail ?? "").replace(/[\u0000-\u0009\u000b-\u001f<>]/g, " ").trim().slice(0, 900),
      tool: clean(o.tool, 120),
      time: clean(o.time, 60),
    };
  }).filter((s) => s.title.length > 2 && s.detail.length > 10);
  return steps.length >= 4 ? steps : null;
}
