import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import AuditForm from "./AuditForm";
import { faqs, handover, solutions, steps } from "@/data/ai-solutions";
import { profile } from "@/data/site";

const title = "AI Marketing & Automation for Your Business";
const description =
  "Star X Marketing sets up WhatsApp automation, lead capture, chatbots, bookings and an AI content system for your business. We build and run it with you for two months, train your team, then hand it over.";

export const metadata: Metadata = {
  title: { absolute: `${title} — Star X Marketing` },
  description,
  alternates: { canonical: "/ai-solutions" },
  openGraph: { title, description, url: `${profile.site}/ai-solutions` },
};

export default function AiSolutionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "AI marketing and automation setup",
        serviceType: "Marketing automation",
        description,
        url: `${profile.site}/ai-solutions`,
        provider: { "@id": `${profile.site}/#starx` },
        areaServed: ["Pakistan", "United Kingdom", "United States", "United Arab Emirates", "Canada"],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main" className="px-5 pb-16 pt-28 md:px-10 md:pt-36">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link href="/" className="hover:text-ink">Home</Link> / AI solutions</nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-base text-mute">Star X Marketing · with Afshal Amir</p>
            <h1 className="display mt-3 text-[11vw] leading-[0.98] md:text-[5.4vw]">AI marketing and automation, set up for your business.</h1>
          </div>
          <p className="text-lg leading-relaxed text-mute lg:col-span-4">For two months we build it and run it with you. Then we train your team and hand everything over, so you run it yourselves.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#audit" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111] transition-transform active:scale-[0.97]">Get a free AI audit <Icon name="ArrowRight" className="h-4 w-4" /></a>
          <a href="#how" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-4 text-sm font-medium transition-colors hover:border-white/60">How it works</a>
        </div>

        <section id="solutions" className="scroll-mt-24 pt-16 md:pt-24">
          <h2 className="display text-3xl md:text-5xl">What we can set up</h2>
          <p className="mt-3 max-w-2xl text-lg text-mute">Most businesses start with one to three of these. The audit tells us which ones are worth it for you.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <li key={s.key} className="rounded-[20px] border border-line bg-bg-2 p-6">
                <Icon name={s.icon} className="h-6 w-6 text-accent" />
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-snug text-mute">{s.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-mute">Want to see AI write for a business? <Link href="/ai#create" className="text-accent underline underline-offset-4">Try the free content generator</Link>.</p>
        </section>

        <section id="how" className="scroll-mt-24 pt-16 md:pt-24">
          <h2 className="display text-3xl md:text-5xl">How it works</h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-[20px] border border-line bg-bg-2 p-6">
                <span className="label text-accent">{String(i + 1).padStart(2, "0")} · {s.when}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-snug text-mute">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-6 pt-16 md:pt-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display text-3xl md:text-5xl">What you keep</h2>
            <p className="mt-3 text-lg text-mute">Everything is built on your own accounts from the first day, so the handover is just giving you the keys.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {handover.map((h) => (
              <li key={h} className="flex gap-3 rounded-[20px] border border-line bg-bg-2 p-5"><Icon name="Check" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />{h}</li>
            ))}
          </ul>
        </section>

        <section id="audit" className="scroll-mt-24 pt-16 md:pt-24">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display text-3xl md:text-5xl">Get a free AI audit</h2>
              <p className="mt-3 text-lg text-mute">Tell us about your business and what takes up most of your time. We reply on WhatsApp with what we would automate first and a quote.</p>
              <p className="mt-4 text-mute">Prefer to talk? <a href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Hi, I'd like a free AI audit for my business.")}`} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">Message us on WhatsApp</a>.</p>
            </div>
            <div className="lg:col-span-7"><AuditForm whatsapp={profile.whatsapp} options={solutions.map((s) => ({ key: s.key, title: s.title }))} /></div>
          </div>
        </section>

        <section className="pt-16 md:pt-24">
          <h2 className="display text-3xl md:text-5xl">Questions</h2>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-[20px] border border-line bg-bg-2 p-5 open:border-white/25">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">{f.q}<Icon name="ChevronUp" className="h-5 w-5 shrink-0 rotate-180 text-mute transition-transform group-open:rotate-0" /></summary>
                <p className="mt-3 leading-relaxed text-mute">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-16 text-lg">See the websites and campaigns behind this: <Link href="/portfolio" className="text-accent underline underline-offset-4">open the portfolio</Link>.</p>
      </main>
      <Footer />
    </>
  );
}
