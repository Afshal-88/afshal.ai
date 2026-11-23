// Website-development showcase data, built from the real projects in v2.ts and site.ts.
import { websites } from "./v2";
import { projects } from "./site";
import type { StackSite } from "@/components/web/SiteStack";
import type { IndexItem } from "@/components/web/SiteIndex";

const FEATURED = ["Keune Pakistan", "House of Flowers", "Lawyers Connect", "Buzzazi", "ARTOSO"];

export const featuredSites: StackSite[] = FEATURED.map((n) => websites.find((w) => w.name === n)!).filter(Boolean).map((w) => ({
  name: w.name, domain: w.domain, type: w.type, desktop: w.desktop!, mobile: w.mobile, stack: w.stack,
  href: w.slug ? `/work/${w.slug}` : `https://${w.domain}`, external: !w.slug,
}));

const fromSites: IndexItem[] = websites.map((w) => ({
  name: w.name, type: w.type, img: w.desktop, href: w.slug ? `/work/${w.slug}` : `https://${w.domain}`, external: !w.slug,
}));
const seen = new Set(websites.map((w) => w.slug).filter(Boolean));
const fromProjects: IndexItem[] = projects.filter((p) => !seen.has(p.slug)).map((p) => ({
  name: p.name, type: p.industry, img: p.cover || undefined, href: `/work/${p.slug}`, external: false,
}));
export const allSites: IndexItem[] = [...fromSites, ...fromProjects];

export const webServices = [
  { icon: "Code2", title: "Custom websites", line: "Designed from scratch, with motion and fast load times." },
  { icon: "ShoppingCart", title: "Shopify stores", line: "Theme, products, payments, shipping and WhatsApp ordering." },
  { icon: "Globe", title: "WordPress & Elementor", line: "Sites your team can edit without a developer." },
  { icon: "Layers", title: "3D & animated sites", line: "Scroll effects, 3D heroes and page transitions." },
  { icon: "Rocket", title: "Landing pages", line: "One page, one goal, for ads and launches." },
  { icon: "ShoppingBag", title: "WooCommerce", line: "Online shops on WordPress with full checkout." },
  { icon: "LayoutDashboard", title: "Portals & dashboards", line: "Logins, roles, live numbers and admin panels." },
  { icon: "Cloud", title: "SaaS websites", line: "Product site, pricing, docs and sign-up flow." },
  { icon: "Search", title: "SEO built in", line: "Titles, schema, sitemap and speed from day one." },
  { icon: "Wrench", title: "Care & updates", line: "Monthly fixes, backups, new pages and speed checks." },
];

export const buildSteps = [
  { title: "Plan", body: "Pages, goals and the content each page needs." },
  { title: "Design", body: "Look, motion and layouts, approved before code." },
  { title: "Build", body: "Fast, mobile-first code with SEO set up." },
  { title: "Launch", body: "Domain, tracking, testing and handover." },
];
