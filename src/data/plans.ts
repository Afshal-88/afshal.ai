/**
 * Brand plan quiz: questions, prices and the plan builder.
 * Safe to import on the client: it holds no private data.
 *
 * Prices are in USD. They were set against 2026 market rates:
 * Pakistan agencies charge about PKR 10,000–70,000 a month for social media management
 * and PKR 35,000–60,000 for a basic business website; US small-business retainers start
 * around $400–500 a month. Our monthly plans sit at the professional end of Pakistan and
 * well below US/UK agencies, so they work for local and overseas clients.
 * Change the numbers in `tiers` and `setupBy` below to update every plan on the site.
 */

export type BrandStage = "existing" | "new";
export type BizType = "ecommerce" | "local" | "property" | "company" | "saas" | "creator";
export type Answers = {
  stage?: BrandStage;
  type?: BizType;
  goal?: string;
  platforms?: string[];
  posting?: string;
  ads?: string;
  problems?: string[];
  market?: string;
  budget?: string;
  newStage?: string;
  have?: string[];
  launch?: string;
  website?: string;
  social?: string;
};

export type Option = { value: string; label: string; icon?: string };
export type Question = {
  key: keyof Answers;
  title: string;
  hint?: string;
  kind: "one" | "many" | "links";
  options?: Option[];
  when?: (a: Answers) => boolean;
};

export const bizTypes: (Option & { value: BizType })[] = [
  { value: "ecommerce", label: "Online store (Shopify, Daraz, Instagram shop)", icon: "ShoppingBag" },
  { value: "local", label: "Local business (restaurant, salon, clinic, gym)", icon: "Store" },
  { value: "property", label: "Construction or real estate", icon: "Building2" },
  { value: "company", label: "Company or service business (B2B, consultancy, agency)", icon: "Briefcase" },
  { value: "saas", label: "Software, SaaS or mobile app", icon: "AppWindow" },
  { value: "creator", label: "Personal brand, coach or creator", icon: "UserRound" },
];

const isNew = (a: Answers) => a.stage === "new";
const isOld = (a: Answers) => a.stage === "existing";

export const questions: Question[] = [
  { key: "stage", title: "Is this an existing brand or a new one?", kind: "one", options: [
    { value: "existing", label: "Existing brand: market what I already have", icon: "TrendingUp" },
    { value: "new", label: "New brand: help me build and launch it", icon: "Rocket" },
  ] },
  { key: "type", title: "What kind of business is it?", kind: "one", options: bizTypes },
  { key: "website", title: "Where can we see your brand?", hint: "Optional. We'll look at your website before building the plan.", kind: "links", when: isOld },
  { key: "newStage", title: "How far along are you?", kind: "one", when: isNew, options: [
    { value: "idea", label: "Just an idea" },
    { value: "named", label: "Name decided, nothing built yet" },
    { value: "ready", label: "Product or service is ready to sell" },
  ] },
  { key: "have", title: "What do you already have?", hint: "Pick all that apply.", kind: "many", when: isNew, options: [
    { value: "logo", label: "Logo" },
    { value: "colours", label: "Brand colours and fonts" },
    { value: "website", label: "Website" },
    { value: "social", label: "Social media pages" },
    { value: "none", label: "None of these yet" },
  ] },
  { key: "goal", title: "What do you want most in the next 3 months?", kind: "one", options: [
    { value: "sales", label: "More sales or orders", icon: "ShoppingCart" },
    { value: "leads", label: "More leads, calls and enquiries", icon: "PhoneCall" },
    { value: "awareness", label: "More people knowing the brand", icon: "Megaphone" },
    { value: "launch", label: "A strong launch", icon: "Rocket" },
  ] },
  { key: "platforms", title: "Which platforms matter to you?", hint: "Pick all that apply.", kind: "many", options: [
    { value: "instagram", label: "Instagram" }, { value: "facebook", label: "Facebook" }, { value: "tiktok", label: "TikTok" },
    { value: "linkedin", label: "LinkedIn" }, { value: "youtube", label: "YouTube" }, { value: "google", label: "Google search and Maps" },
  ] },
  { key: "posting", title: "How often do you post right now?", kind: "one", when: isOld, options: [
    { value: "never", label: "Rarely or never" }, { value: "weekly", label: "About once a week" },
    { value: "often", label: "A few times a week" }, { value: "daily", label: "Every day" },
  ] },
  { key: "ads", title: "Are you running paid ads?", kind: "one", when: isOld, options: [
    { value: "no", label: "No" }, { value: "boost", label: "Only boosting posts" }, { value: "yes", label: "Yes, proper campaigns" },
  ] },
  { key: "problems", title: "What's holding you back?", hint: "Pick all that apply.", kind: "many", when: isOld, options: [
    { value: "time", label: "No time to post" }, { value: "reach", label: "Low reach and few followers" },
    { value: "sales", label: "Social media doesn't bring sales" }, { value: "site", label: "Website is old or slow" },
    { value: "nosite", label: "No website" }, { value: "google", label: "Can't be found on Google" },
  ] },
  { key: "launch", title: "When do you want to launch?", kind: "one", when: isNew, options: [
    { value: "month", label: "Within a month" }, { value: "quarter", label: "In 1 to 3 months" }, { value: "later", label: "Later, I'm planning ahead" },
  ] },
  { key: "market", title: "Where are your customers?", kind: "one", options: [
    { value: "city", label: "In my city" }, { value: "pakistan", label: "All over Pakistan" },
    { value: "abroad", label: "Outside Pakistan" }, { value: "mix", label: "Pakistan and abroad" },
  ] },
  { key: "budget", title: "Monthly budget for our work?", hint: "Not counting ad spend, which you pay to Meta or Google directly.", kind: "one", options: [
    { value: "s", label: "Under $100" }, { value: "m", label: "$100 to $300" }, { value: "l", label: "$300 to $500" }, { value: "xl", label: "$500 or more" },
  ] },
];

export const visibleQuestions = (a: Answers) => questions.filter((q) => !q.when || q.when(a));

export type TierKey = "basic" | "standard" | "premium";
export const tiers: { key: TierKey; name: string; monthly: number; setupBase: number; platforms: number; posts: number; reels: number }[] = [
  { key: "basic", name: "Basic", monthly: 79, setupBase: 99, platforms: 2, posts: 12, reels: 4 },
  { key: "standard", name: "Standard", monthly: 199, setupBase: 249, platforms: 3, posts: 20, reels: 8 },
  { key: "premium", name: "Premium", monthly: 399, setupBase: 499, platforms: 4, posts: 30, reels: 12 },
];

/** One-time setup price by business type, per tier [basic, standard, premium]. */
const setupBy: Record<BizType, [number, number, number]> = {
  ecommerce: [199, 399, 699],
  local: [99, 249, 449],
  property: [129, 299, 499],
  company: [99, 249, 499],
  saas: [149, 349, 599],
  creator: [99, 199, 399],
};
/** Added to setup for a new brand: logo and brand kit. */
const brandKit: [number, number, number] = [50, 100, 150];

const setupWork: Record<BizType, [string, string, string]> = {
  ecommerce: ["Shopify store with up to 20 products and payments", "Shopify store with up to 60 products, reviews and WhatsApp ordering", "Custom Shopify store, up to 150 products, upsells and abandoned-cart emails"],
  local: ["5-page website with Google Maps and WhatsApp button", "Website with menu or booking page and Google Business Profile set up", "Website with online booking, reviews page and Google Business Profile"],
  property: ["Website with projects gallery and enquiry form", "Website with project pages, floor plans and lead form to WhatsApp", "Website with project pages, 3D-style project hero and lead tracking"],
  company: ["5-page company website with contact form", "Company website with service pages and case-study layout", "Company website with service pages, blog and lead capture"],
  saas: ["Landing page with sign-up or waitlist", "Product site with features, pricing and docs pages", "Product site, pricing, docs and launch page with product demo video"],
  creator: ["Personal website with links and contact", "Portfolio website with work, services and booking", "3D portfolio website with work, services, booking and newsletter"],
};

const focus: Record<BizType, string> = {
  ecommerce: "Product reels and catalogue ads that send people to your store",
  local: "Google Business Profile posts, reviews and local reels",
  property: "Project walkthrough reels and lead forms that go to WhatsApp",
  company: "LinkedIn company page and founder posts that build trust",
  saas: "Demo videos and launch content that drive sign-ups",
  creator: "Personal brand reels and posts in your own voice",
};

export type Plan = {
  key: TierKey; name: string; monthly: number; setup: number; recommended: boolean;
  setupItems: string[]; monthlyItems: string[];
};

const pick = (a: Answers): TierKey => {
  let i = { s: 0, m: 1, l: 1, xl: 2 }[a.budget ?? "s"] ?? 0;
  if (a.budget === "l" && (a.ads === "yes" || (a.platforms?.length ?? 0) > 3)) i = 2;
  if (i === 0 && a.ads === "yes") i = 1;
  return tiers[i].key;
};

export function buildPlans(a: Answers): Plan[] {
  const type = a.type ?? "company";
  const fresh = a.stage === "new";
  const rec = pick(a);
  const hasSite = fresh ? a.have?.includes("website") : !a.problems?.includes("nosite");
  return tiers.map((t, i) => {
    const setupItems = [
      hasSite && !fresh ? (i === 0 ? "Website fixes: speed, mobile and SEO basics" : `Rebuild: ${setupWork[type][i]}`) : setupWork[type][i],
      i === 0 ? "On-page SEO: titles, descriptions, sitemap" : "SEO setup: keywords, on-page SEO, Google Search Console",
      `${i === 0 ? "Set up 2" : i === 1 ? "Set up 3" : "Set up 4"} social profiles with bio and highlights`,
    ];
    if (fresh) setupItems.unshift(["Simple logo and colour palette", "Logo, colours, fonts and post templates", "Full brand identity: logo set, guidelines and templates"][i]);
    if (i > 0) setupItems.push("Meta Pixel and Google Analytics tracking");
    const monthlyItems = [
      `${t.posts} posts a month, ${t.reels} of them reels`,
      `Manage ${t.platforms} platforms: posting, captions and hashtags`,
      focus[type],
      i === 0 ? "Basic SEO upkeep and one website update" : `${i === 1 ? 2 : 4} SEO blog articles and website updates`,
      i === 0 ? "Monthly report" : i === 1 ? "Ad campaigns on Meta, monthly report and call" : "Ads on Meta and Google, reports every two weeks",
    ];
    if (i === 1) monthlyItems.push("Replies to comments and messages on weekdays");
    if (i === 2) monthlyItems.push("WhatsApp or AI chatbot for enquiries", "Landing pages for campaigns");
    return {
      key: t.key, name: t.name, monthly: t.monthly,
      setup: setupBy[type][i] + (fresh ? brandKit[i] : 0),
      recommended: t.key === rec, setupItems, monthlyItems,
    };
  });
}

/** First 30 days, based on the answers and what we saw on the website. */
export function firstSteps(a: Answers, seen?: SiteSeen | null): string[] {
  const out: string[] = [];
  if (a.stage === "new") {
    if (!a.have?.includes("logo")) out.push("Design your logo and brand colours");
    if (!a.have?.includes("website")) out.push("Build your website and connect your domain");
    out.push(a.launch === "month" ? "Plan a 2-week launch: teaser posts, launch day, offer" : "Grow pages before launch with behind-the-scenes content");
  } else {
    if (a.problems?.includes("nosite")) out.push("Build your website first, so ads and posts have somewhere to send people");
    else if (seen && seen.issues.length) out.push(`Fix your website: ${seen.issues[0].toLowerCase()}`);
    else if (a.problems?.includes("site")) out.push("Speed up your website and fix mobile issues");
    if (a.problems?.includes("google") || a.platforms?.includes("google")) out.push("Set up Google Business Profile and on-page SEO");
    if (a.posting === "never" || a.problems?.includes("time")) out.push("Start a fixed posting schedule, so you never need to think about it");
    if (a.problems?.includes("sales") || a.goal === "sales") out.push("Add a clear offer and WhatsApp call to action on every post");
    if (a.ads === "boost") out.push("Move from boosting posts to proper ad campaigns with tracking");
  }
  if (a.market === "abroad" || a.market === "mix") out.push("Write content and ads in English for overseas buyers");
  return [...new Set(out)].slice(0, 4);
}

export type SiteSeen = { url: string; title: string; ok: boolean; issues: string[]; good: string[]; socials: string[] };

export type PlanRequest = {
  id: string; name: string; business: string; whatsapp: string; email: string;
  answers: Answers; recommended: string; summary: string[]; createdAt: string;
};
