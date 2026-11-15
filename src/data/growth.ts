// Growth Plan: a business owner's step-by-step AI marketing roadmap.
// Module text is guidance for the AI and short copy for the dashboard. No prices or results.

export const modules = [
  {
    key: "website",
    icon: "Globe",
    title: "Website",
    body: "A fast, clear website that turns visitors into WhatsApp messages and calls.",
    brief:
      "Website setup or improvement: choosing a platform they can manage (WordPress, Shopify, or a simple landing page), domain and hosting, the pages they need, speed on mobile, a clear offer above the fold, WhatsApp/click-to-call buttons, contact form, Google Analytics 4 and Search Console setup. If they already have a website, start with checking it (the free website check on this site) and fixing the biggest problems first.",
  },
  {
    key: "seo",
    icon: "Search",
    title: "SEO",
    body: "Show up on Google when people search for what you sell, in your city.",
    brief:
      "Search engine optimisation for a small business: Google Business Profile setup and weekly updates, choosing 10 to 20 keywords people actually type (including Roman Urdu and city names where relevant), one page per main service or product, titles and meta descriptions, blog topics that answer customer questions, getting listed in local directories, collecting Google reviews the honest way.",
  },
  {
    key: "geo",
    icon: "Brain",
    title: "GEO (AI search)",
    body: "Get mentioned when people ask ChatGPT, Gemini or Google AI about your kind of business.",
    brief:
      "Generative engine optimisation: making the business easy for AI assistants to understand and recommend. Consistent name, address, phone and description everywhere; an FAQ page in plain language; clear service and price-range pages; schema markup (LocalBusiness, FAQ); being mentioned on trusted sites, directories and in reviews; checking monthly by asking ChatGPT, Gemini and Google AI Overviews the questions customers ask and noting whether the business appears.",
  },
  {
    key: "content",
    icon: "CalendarDays",
    title: "Content plan",
    body: "A month of posts, reels and stories planned around your products and Pakistani dates.",
    brief:
      "A content plan: 3 to 4 content pillars for this business, a weekly rhythm (how many posts, reels, stories), a monthly calendar that uses relevant dates in Pakistan (Ramadan, Eid, 14 August, 11.11, wedding season, school terms, Black Friday where relevant), reel ideas with hooks, using the free AI content generator on this site for captions in English or Roman Urdu, batching content creation on one day a week.",
  },
  {
    key: "social",
    icon: "Send",
    title: "Social media & posting",
    body: "Set up your pages properly and post on a schedule without doing it every day.",
    brief:
      "Social media setup and scheduled posting: optimise Facebook, Instagram and TikTok profiles (bio, highlights, link, WhatsApp button), connect them in Meta Business Suite, schedule posts a week ahead in Meta Business Suite (free) or similar, reply to comments and DMs daily with saved replies, set up WhatsApp Business catalogue and quick replies, track which posts bring messages.",
  },
  {
    key: "ads",
    icon: "MousePointerClick",
    title: "Google Ads",
    body: "A small, careful Google Ads campaign that brings calls and messages, not wasted clicks.",
    brief:
      "Google Ads for a small budget: set up the account and conversion tracking (calls, WhatsApp clicks, form submits) first, start with one Search campaign targeting their city, 2 to 3 ad groups by service, exact and phrase match keywords, negative keywords, location and schedule settings, responsive search ad copy, a sensible daily budget the owner chooses, checking search terms weekly, and when to try Performance Max or Meta ads instead.",
  },
] as const;

export type ModuleKey = (typeof modules)[number]["key"];
export const moduleKeys = modules.map((m) => m.key) as ModuleKey[];

export const businessTypes = [
  "Restaurant / café / food",
  "Clothing / fashion",
  "Beauty / salon / clinic",
  "Online store (e-commerce)",
  "Real estate",
  "Education / academy",
  "Health / doctor",
  "Services (repair, cleaning, etc.)",
  "Professional (law, accounts, consulting)",
  "Manufacturing / wholesale",
  "Other",
];

export const goals = [
  "More WhatsApp messages and calls",
  "More online sales",
  "More people visiting my shop",
  "Show up on Google",
  "Build my brand on social media",
  "Hire / grow my team",
];

export const languages = [
  { key: "english", label: "English" },
  { key: "roman-urdu", label: "Roman Urdu" },
] as const;
