import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/Magnetic";
import { FadeUp, SplitLines } from "@/components/Reveal";
import { ContactButton } from "@/components/ui/ContactModal";
import WebsiteCheck from "@/components/sections/WebsiteCheck";
import Contact from "@/components/sections/Contact";
import HeroX, { FlatX } from "@/components/starx/HeroX";
import ServiceGrid from "@/components/starx/ServiceGrid";
import { process, starxServices } from "@/data/starx-home";
import { starx } from "@/data/v2";
import { profile } from "@/data/site";

const title = "Star X Marketing — Digital Marketing Agency in Lahore";
const description =
  "Star X Marketing is a digital marketing agency in Lahore led by Afshal Amir: branding, websites, e-commerce, social media, video, paid ads, AI integration and business automation.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", title, description, url: profile.site, siteName: "Star X Marketing" },
  twitter: { card: "summary_large_image", title, description },
};

const facts: [string, React.ReactNode][] = [
  ["Based in", "Lahore, Pakistan"],
  ["Led by", <Link key="l" href="/portfolio" className="text-accent underline-offset-4 hover:underline">Afshal Amir, Marketing Director</Link>],
  ["Services", `${starxServices.length}, from branding to automation`],
  ["Experience", "50+ websites built by our lead, for clients in Pakistan, the UK, the US, the UAE and Canada"],
  ["Instagram", <a key="i" href={starx.instagram} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">{starx.handle}</a>],
  ["WhatsApp", <a key="w" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">0342 0757848</a>],
];

export default function StarXHome() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${profile.site}/#home`,
    url: profile.site,
    name: title,
    description,
    about: { "@id": `${profile.site}/#starx` },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main">
        <section className="relative overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-16 md:pt-32">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 text-base text-mute"><FlatX className="h-5 w-auto" /> Star X Marketing · Lahore</p>
              <SplitLines as="h1" className="display mt-5 text-[12vw] leading-[0.98] md:text-[5.6vw]" lines={["Branding, websites,", "marketing and", <span key="a" className="text-accent">AI automation.</span>]} />
              <FadeUp delay={0.3}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute md:text-xl">We are a digital marketing agency led by Afshal Amir. One team plans and runs your brand, website and marketing, so every part works from the same plan.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic>
                    <ContactButton className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111] transition-transform active:scale-[0.97]">Start a project <Icon name="ArrowRight" className="h-4 w-4" /></ContactButton>
                  </Magnetic>
                  <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-4 text-sm font-medium transition-colors hover:border-white/60">Our services</a>
                  <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-full px-4 py-4 text-sm font-medium text-mute transition-colors hover:text-ink">See Afshal&apos;s portfolio <Icon name="ArrowUpRight" className="h-4 w-4" /></Link>
                </div>
              </FadeUp>
            </div>
            <div className="mx-auto w-full max-w-[560px] lg:col-span-5"><HeroX /></div>
          </div>
        </section>

        <div className="border-y border-line py-5">
          <Marquee speed={45} gap="2.5rem">
            {starxServices.map((s) => (
              <span key={s.title} className="flex items-center gap-10 whitespace-nowrap">
                <span className="display text-2xl md:text-4xl">{s.title}</span>
                <FlatX className="h-6 w-auto md:h-8" />
              </span>
            ))}
          </Marquee>
        </div>

        <section id="services" className="scroll-mt-20 px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <SplitLines className="display text-4xl md:col-span-7 md:text-6xl" lines={["What we do"]} />
            <p className="text-lg text-mute md:col-span-5">Ten services under one roof. Most businesses start with one or two and add more once the first is working.</p>
          </div>
          <div className="mt-10"><ServiceGrid items={starxServices} /></div>
        </section>

        <section className="px-5 md:px-10">
          <FadeUp>
            <div className="grid gap-6 rounded-[28px] bg-accent p-6 text-[#111] md:grid-cols-12 md:p-10">
              <div className="md:col-span-8">
                <p className="text-sm font-semibold uppercase tracking-wide">AI solutions</p>
                <h2 className="display mt-3 text-4xl md:text-5xl">We set up your AI, run it for two months, then hand it over.</h2>
                <p className="mt-4 max-w-2xl text-lg">WhatsApp replies, lead capture, chatbots, bookings and an AI content system, built on your own accounts. We train your team so you can run it yourselves.</p>
              </div>
              <div className="flex flex-wrap items-end gap-3 md:col-span-4 md:justify-end">
                <Link href="/ai-solutions" className="inline-flex items-center gap-2 rounded-full bg-[#111] px-6 py-4 text-sm font-semibold text-white transition-transform active:scale-[0.97]">Get a free AI audit <Icon name="ArrowRight" className="h-4 w-4" /></Link>
                <Link href="/ai" className="inline-flex items-center gap-2 rounded-full border border-black/40 px-6 py-4 text-sm font-semibold">Try the free AI tools</Link>
              </div>
            </div>
          </FadeUp>
        </section>

        <section id="process" className="px-5 py-16 md:px-10 md:py-24">
          <SplitLines className="display text-4xl md:text-6xl" lines={["How we work"]} />
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.08} className="h-full">
                <li className="group h-full rounded-[24px] border border-line p-6 transition-colors duration-300 hover:border-white/30">
                  <span className="display block text-5xl text-accent transition-transform duration-500 group-hover:-translate-y-1">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-mute">{p.body}</p>
                </li>
              </FadeUp>
            ))}
          </ol>
        </section>

        <section id="about" className="scroll-mt-20 px-5 pb-16 md:px-10 md:pb-24">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-[28px] border border-line bg-bg-2 p-6 md:p-10 lg:col-span-7">
              <img src="/brand/starx-logo.webp" alt="Star X Marketing logo" width={425} height={240} className="h-20 w-auto md:h-24" loading="lazy" />
              <h2 className="display mt-8 text-3xl md:text-5xl">About Star X Marketing</h2>
              <p className="mt-4 text-lg leading-relaxed text-mute">{starx.pitch} Brand, website, social media, ads and automation are planned together, so they support each other instead of pulling in different directions.</p>
              <dl className="mt-8 grid gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-2">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="label text-dim">{k}</dt>
                    <dd className="mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Link href="/portfolio" className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[28px] border border-line lg:col-span-5">
              <img src="/img/me-suit.webp" alt="Afshal Amir" width={720} height={900} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,15,15,.95),rgba(15,15,15,.2)_55%,transparent)]" />
              <div className="relative p-6 md:p-8">
                <p className="label text-accent">Led by</p>
                <p className="display mt-2 text-4xl">Afshal Amir</p>
                <p className="mt-2 max-w-sm text-mute">Marketing Director of Star X. Software engineer by degree, digital marketer by trade, with a LUMS digital marketing certificate.</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg transition-colors group-hover:bg-accent group-hover:text-[#111]">See my portfolio <Icon name="ArrowRight" className="h-4 w-4" /></span>
              </div>
            </Link>
          </div>
        </section>

        <WebsiteCheck />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
