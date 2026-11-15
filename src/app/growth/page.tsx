import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import GrowthApp from "./GrowthApp";
import { profile } from "@/data/site";

const title = "Free AI Growth Plan for Your Business";
const description =
  "Tell us about your business and get a step-by-step AI marketing plan for your website, SEO, AI search (GEO), content, social media and Google Ads. Tick steps off as you go. Free.";

export const metadata: Metadata = {
  title: { absolute: `${title} — Afshal.ai` },
  description,
  alternates: { canonical: "/growth" },
  openGraph: { title, description, url: `${profile.site}/growth` },
};

export default function GrowthPage() {
  return (
    <>
      <main id="main" className="px-5 pb-16 pt-28 md:px-10 md:pt-36">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link href="/" className="hover:text-ink">Home</Link> / Growth Plan</nav>
        <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-base text-mute">Free · made with AI</p>
            <h1 className="display mt-3 text-[11vw] leading-[0.98] md:text-[5.4vw]">Your marketing, step by step.</h1>
          </div>
          <p className="text-lg leading-relaxed text-mute lg:col-span-4">Website, SEO, AI search, content, social media and Google Ads. A plan written for your business, in English or Roman Urdu.</p>
        </div>
        <div className="mt-10"><GrowthApp /></div>
      </main>
      <Footer />
    </>
  );
}
