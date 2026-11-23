import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/Magnetic";
import { SplitLines, FadeUp } from "@/components/Reveal";
import { ContactButton } from "@/components/ui/ContactModal";
import StarField from "@/components/starx/StarField";
import SiteStack from "@/components/web/SiteStack";
import SiteIndex from "@/components/web/SiteIndex";
import WebServices from "@/components/web/WebServices";
import { allSites, featuredSites } from "@/data/web";
import { profile } from "@/data/site";

const title = "Website Development in Lahore — Custom, Shopify & WordPress";
const description = "Star X Marketing designs and builds fast, animated websites, Shopify stores and WordPress sites for businesses in Pakistan, the UK, the US, the UAE and Canada.";

export const metadata: Metadata = {
  title: { absolute: `${title} — Star X Marketing` }, description, alternates: { canonical: "/website-development" },
  openGraph: { title, description, url: `${profile.site}/website-development`, images: [featuredSites[0]?.desktop ?? "/opengraph-image.jpg"] },
};

export default function WebsiteDevelopmentPage() {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Service", name: "Website development", serviceType: "Website design and development",
    provider: { "@id": `${profile.site}/#starx` }, areaServed: ["Pakistan", "United Kingdom", "United States", "United Arab Emirates", "Canada"], url: `${profile.site}/website-development`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main">
        <section className="relative overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pt-36">
          <StarField />
          <div className="relative">
            <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link href="/" className="hover:text-ink">Home</Link> / Website development</nav>
            <SplitLines as="h1" className="display mt-6 text-[14vw] leading-[0.9] md:text-[8.4vw]" lines={["Websites", "that move.", <span key="a" className="text-accent">Built to sell.</span>]} />
            <FadeUp delay={0.3}>
              <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
                <p className="text-lg text-mute md:col-span-6 md:text-xl">Custom websites, Shopify stores and WordPress sites with motion, fast load times and SEO set up from day one.</p>
                <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
                  <Magnetic><Link href="/plan" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111]">Get a website plan <Icon name="ArrowRight" className="h-4 w-4" /></Link></Magnetic>
                  <ContactButton topic="Website Development" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-4 text-sm font-medium hover:border-white/60">Talk to us</ContactButton>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        <section className="px-5 md:px-10"><SiteStack sites={featuredSites} /></section>

        <section className="px-5 pb-16 pt-8 md:px-10 md:pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-4xl md:text-6xl">All work</h2>
            <p className="label text-dim">{allSites.length} projects</p>
          </div>
          <div className="mt-8"><SiteIndex items={allSites} /></div>
        </section>

        <section className="relative overflow-hidden px-5 pb-20 md:px-10 md:pb-28">
          <StarField density={0.5} />
          <SplitLines className="relative display text-4xl md:text-6xl" lines={["What we build"]} />
          <div className="relative mt-10"><WebServices /></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
