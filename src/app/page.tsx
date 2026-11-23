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
import HeroVisual from "@/components/web/HeroVisual";
import ServiceGrid from "@/components/starx/ServiceGrid";
import SiteStack from "@/components/web/SiteStack";
import SiteIndex from "@/components/web/SiteIndex";
import WebServices from "@/components/web/WebServices";
import { allSites, featuredSites } from "@/data/web";
import DesignGallery from "@/components/starx/DesignGallery";
import InstagramFeed from "@/components/starx/InstagramFeed";
import OpeningBanner from "@/components/starx/OpeningBanner";
import StarField from "@/components/starx/StarField";
import SolutionsGrid from "@/components/solutions/SolutionsGrid";
import { process, starxServices } from "@/data/starx-home";
import { promptCount } from "@/data/prompts";
import { proCount } from "@/data/prompts-pro";
import { toolGroups } from "@/data/hub";
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

const toolCount = toolGroups.reduce((n, g) => n + g.tools.length, 0);

const freeTools = [
  { icon: "Sparkles", title: "AI content generator", body: "Reel scripts, hooks, captions and a 7-day content plan for your business, in English, Roman Urdu or Urdu.", href: "/ai#create", cta: "Write my content" },
  { icon: "FileText", title: "Prompt library", body: `${promptCount + proCount} ready prompts for reels, AI video, ads, SEO and sales. ${promptCount} free with an account.`, href: "/prompts", cta: "Browse prompts" },
  { icon: "Wrench", title: "AI tools directory", body: `${toolCount} AI tools for writing, images, video, voice and automation, grouped by job.`, href: "/tools", cta: "See the tools" },
  { icon: "Gauge", title: "Free website check", body: "Speed, SEO, accessibility and security scores for any website, with what to fix first.", href: "#website-check", cta: "Check my website" },
];

const explore = [
  { icon: "Layers", title: "Services", body: "Ten services, from branding to automation.", href: "#services" },
  { icon: "Bot", title: "AI solutions", body: "We set it up, run it two months, hand it over.", href: "/ai-solutions" },
  { icon: "Briefcase", title: "Afshal's portfolio", body: "Websites, campaigns, design and experience.", href: "/portfolio" },
  { icon: "Target", title: "Marketing plan", body: "10 questions, 3 plans with prices.", href: "/plan" },
  { icon: "GraduationCap", title: "Build with AI", body: "Portfolio, website, app, video, copy.", href: "/solutions" },
  { icon: "FileText", title: "Prompt library", body: `${promptCount + proCount} prompts in 10 categories.`, href: "/prompts" },
  { icon: "MessageCircle", title: "Contact", body: "WhatsApp or the form, we reply fast.", href: "#contact" },
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
        <OpeningBanner />
        <section id="intro" className="relative scroll-mt-0 overflow-hidden px-5 pb-10 pt-24 md:px-10 md:pb-16 md:pt-28">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SplitLines as="h1" className="display text-[12vw] leading-[0.98] md:text-[5.6vw]" lines={["Websites with", "motion, built", <span key="a" className="text-accent">to bring customers.</span>]} />
              <FadeUp delay={0.3}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute md:text-xl">We design and build fast, animated websites and Shopify stores, then market them. Led by Afshal Amir.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic>
                    <ContactButton className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111] transition-transform active:scale-[0.97]">Start a project <Icon name="ArrowRight" className="h-4 w-4" /></ContactButton>
                  </Magnetic>
                  <a href="#websites" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-4 text-sm font-medium transition-colors hover:border-white/60">See our websites</a>
                  <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-full px-4 py-4 text-sm font-medium text-mute transition-colors hover:text-ink">See Afshal&apos;s portfolio <Icon name="ArrowUpRight" className="h-4 w-4" /></Link>
                </div>
              </FadeUp>
            </div>
            <div className="lg:col-span-5"><HeroVisual /></div>
          </div>
        </section>

        <div className="border-y border-line py-5">
          <Marquee speed={45} gap="2.5rem">
            {starxServices.map((s) => (
              <span key={s.title} className="flex items-center gap-10 whitespace-nowrap">
                <span className="display text-2xl md:text-4xl">{s.title}</span>
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-accent md:h-7 md:w-7"><path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0Z" /></svg>
              </span>
            ))}
          </Marquee>
        </div>

        <section id="websites" className="scroll-mt-20 px-5 pt-16 md:px-10 md:pt-24">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="label text-accent">Website development</p>
              <SplitLines className="display mt-3 text-[13vw] leading-[0.92] md:text-[7vw]" lines={["Selected", "websites"]} />
            </div>
            <p className="text-lg text-mute md:col-span-4">Built by Afshal Amir and the Star X team. Scroll through, tap one to open it.</p>
          </div>
          <div className="mt-6"><SiteStack sites={featuredSites} /></div>
        </section>

        <section id="all-websites" className="px-5 pb-16 pt-8 md:px-10 md:pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-4xl md:text-6xl">All work</h2>
            <p className="label text-dim">{allSites.length} projects</p>
          </div>
          <div className="mt-8"><SiteIndex items={allSites} /></div>
        </section>

        <section id="web-development" className="relative scroll-mt-20 overflow-hidden px-5 pb-16 md:px-10 md:pb-24">
          <StarField density={0.5} />
          <div className="relative grid gap-6 md:grid-cols-12 md:items-end">
            <SplitLines className="display text-4xl md:col-span-7 md:text-6xl" lines={["What we build"]} />
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <Link href="/plan" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111]">Get a website plan <Icon name="ArrowRight" className="h-4 w-4" /></Link>
              <ContactButton topic="Website Development" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-4 text-sm font-medium hover:border-white/60">Talk to us</ContactButton>
            </div>
          </div>
          <div className="relative mt-10"><WebServices /></div>
        </section>

        <section aria-label="One team" className="px-5 pb-16 md:px-10 md:pb-24">
          <div className="group relative overflow-hidden rounded-[32px] border border-line">
            <img src="/visuals/agency-team.webp" alt="A digital agency team at work (AI-generated illustration)" width={2000} height={994} loading="lazy" className="h-[420px] w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.04] md:h-[520px]" />
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,.92),rgba(10,10,10,.35)_55%,rgba(10,10,10,.1))]" />
            <div className="absolute inset-x-0 bottom-0 grid gap-6 p-6 md:grid-cols-12 md:items-end md:p-12">
              <div className="md:col-span-8">
                <p className="label text-accent">Websites · Marketing · Software</p>
                <h2 className="display mt-3 text-4xl leading-[0.95] md:text-6xl">One team from the first page to the first sale.</h2>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
                <Link href="/plan" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111]">Get your plan <Icon name="ArrowRight" className="h-4 w-4" /></Link>
                <ContactButton className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-4 text-sm font-medium text-white hover:border-white">Talk to us</ContactButton>
              </div>
            </div>
          </div>
        </section>

        <section id="plan" className="relative scroll-mt-20 overflow-hidden px-5 pt-16 md:px-10 md:pt-24">
          <div className="relative grid gap-8 overflow-hidden rounded-[32px] border border-line bg-[#07070b] p-6 md:p-12 lg:grid-cols-12 lg:items-center">
            <StarField density={1.4} />
            <img src="/space/spiral-m96.webp" alt="Spiral galaxy photographed by the Hubble Space Telescope" width={1200} height={985} loading="lazy" className="pointer-events-none absolute -right-24 -top-16 w-[420px] max-w-none opacity-60 mix-blend-screen [mask-image:radial-gradient(closest-side,#000_60%,transparent)] md:-right-10 md:w-[560px] lg:static lg:order-2 lg:col-span-5 lg:w-full lg:opacity-100" />
            <div className="relative lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#111]"><Icon name="Target" className="h-3.5 w-3.5" /> 2-minute quiz</p>
              <SplitLines className="display mt-5 text-4xl md:text-6xl" lines={["Get your", "marketing plan"]} />
              <p className="mt-5 max-w-md text-lg text-mute">New or existing brand: answer 10 questions, see 3 plans with prices.</p>
              <ul className="mt-6 flex flex-wrap gap-2 text-sm">
                {["Website", "SEO", "Social media", "Ads"].map((t) => <li key={t} className="rounded-full border border-white/15 px-3 py-1.5">{t}</li>)}
              </ul>
              <div className="mt-8"><Magnetic><Link href="/plan" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111] transition-transform active:scale-[0.97]">Start the quiz <Icon name="ArrowRight" className="h-4 w-4" /></Link></Magnetic></div>
            </div>
          </div>
        </section>

        <section id="build-with-ai" className="relative scroll-mt-20 overflow-hidden px-5 pt-16 md:px-10 md:pt-24">
          <StarField density={0.6} />
          <div className="relative grid gap-6 md:grid-cols-12 md:items-end">
            <SplitLines className="display text-4xl md:col-span-7 md:text-6xl" lines={["Build with AI"]} />
            <p className="text-lg text-mute md:col-span-5">Step-by-step prompts for real projects. First 3 steps free.</p>
          </div>
          <div className="relative mt-10"><SolutionsGrid /></div>
        </section>

        <section id="services" className="scroll-mt-20 px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <SplitLines className="display text-4xl md:col-span-7 md:text-6xl" lines={["What we do"]} />
            <p className="text-lg text-mute md:col-span-5">Ten services. Start with one, add more later.</p>
          </div>
          <div className="mt-10"><ServiceGrid items={starxServices} /></div>
        </section>

        <section aria-label="Start your plan" className="relative mx-5 mb-16 overflow-hidden rounded-[32px] md:mx-10 md:mb-24">
          <img src="/space/cosmic-cliffs.webp" alt="The Cosmic Cliffs in the Carina Nebula, photographed by the James Webb Space Telescope" width={1920} height={1111} loading="lazy" className="h-[340px] w-full object-cover md:h-[460px]" />
          <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,7,11,.85),rgba(7,7,11,.2))]" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <h2 className="display max-w-xl text-4xl md:text-6xl">Ready to market your brand?</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/plan" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111]">Get your plan <Icon name="ArrowRight" className="h-4 w-4" /></Link>
              <ContactButton className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-4 text-sm font-medium text-white hover:border-white">Talk to us</ContactButton>
            </div>
            <p className="mt-4 text-xs text-white/60">Photo: NASA, ESA, CSA, STScI (James Webb Space Telescope)</p>
          </div>
        </section>

        <section id="design" className="scroll-mt-20 px-5 pb-16 md:px-10 md:pb-24">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <SplitLines className="display text-4xl md:col-span-7 md:text-6xl" lines={["Design work"]} />
            <p className="text-lg text-mute md:col-span-5">By Afshal and the team. Tap to see full size.</p>
          </div>
          <div className="mt-10"><DesignGallery /></div>
        </section>

        <section id="instagram" className="scroll-mt-20 px-5 pb-16 md:px-10 md:pb-24">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <SplitLines className="display text-4xl md:col-span-7 md:text-6xl" lines={["On Instagram"]} />
            <p className="text-lg text-mute md:col-span-5">Latest posts and creator campaigns Afshal planned.</p>
          </div>
          <div className="mt-10"><InstagramFeed /></div>
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

        <section id="free-tools" className="relative scroll-mt-20 overflow-hidden px-5 pt-16 md:px-10 md:pt-24">
          <StarField density={0.5} />
          <div className="relative grid gap-6 md:grid-cols-12 md:items-end">
            <SplitLines className="display text-4xl md:col-span-7 md:text-6xl" lines={["Free AI tools"]} />
            <p className="text-lg text-mute md:col-span-5">Free to use, no card needed.</p>
          </div>
          <ul className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {freeTools.map((t, i) => (
              <FadeUp key={t.title} delay={i * 0.06} className="h-full">
                <li className="h-full">
                  <a href={t.href} className="group flex h-full flex-col rounded-[24px] border border-line bg-bg-2 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-[#111] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"><Icon name={t.icon} className="h-6 w-6" /></span>
                    <h3 className="mt-5 text-xl font-semibold">{t.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-mute">{t.body}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">{t.cta} <Icon name="ArrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                  </a>
                </li>
              </FadeUp>
            ))}
          </ul>
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

        <section id="explore" className="relative overflow-hidden px-5 pb-16 md:px-10 md:pb-24">
          <StarField density={0.5} />
          <SplitLines className="display text-4xl md:text-6xl" lines={["Everything on this site"]} />
          <ul className="relative mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {explore.map((e, i) => (
              <FadeUp key={e.title} delay={(i % 4) * 0.05} className="h-full">
                <li className="h-full">
                  <a href={e.href} className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-line p-5 transition-colors duration-300 hover:border-accent md:p-6">
                    <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-y-100" />
                    <span className="relative flex items-center justify-between">
                      <Icon name={e.icon} className="h-6 w-6 text-accent transition-colors duration-300 group-hover:text-[#111]" />
                      <Icon name="ArrowUpRight" className="h-5 w-5 text-mute transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#111]" />
                    </span>
                    <span className="relative mt-6 text-lg font-semibold transition-colors duration-300 group-hover:text-[#111]">{e.title}</span>
                    <span className="relative mt-1 text-sm leading-snug text-mute transition-colors duration-300 group-hover:text-[#111]/75">{e.body}</span>
                  </a>
                </li>
              </FadeUp>
            ))}
          </ul>
        </section>

        <WebsiteCheck />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
