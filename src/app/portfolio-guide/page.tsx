import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import CopyButton from "@/components/hub/CopyButton";
import { currentUser } from "@/lib/auth";
import { guideSteps, guideTeaser } from "@/data/portfolio-guide";
import { profile } from "@/data/site";

const title = "Build Your 3D Portfolio with AI — Free Step-by-Step Guide";
const description = "Turn your portfolio PDF and CV into a 3D portfolio website with Claude, ChatGPT or Gemini, then put it live on Vercel. Six ready prompts, free with an account.";

export const metadata: Metadata = {
  title: { absolute: `${title} — Star X Marketing` },
  description,
  alternates: { canonical: "/portfolio-guide" },
  openGraph: { title, description, url: `${profile.site}/portfolio-guide` },
};

function Teaser() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {guideTeaser.map((t) => (
        <li key={t.title} className="rounded-[22px] border border-line bg-bg-2 p-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-[#111]"><Icon name={t.icon} className="h-6 w-6" /></span>
          <h2 className="mt-5 text-lg font-semibold">{t.title}</h2>
          <p className="mt-1 text-mute">{t.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Locked() {
  return (
    <div className="relative mt-10 overflow-hidden rounded-[28px] border border-line">
      <div aria-hidden className="pointer-events-none select-none p-6 blur-[6px] md:p-10">
        {guideSteps.slice(0, 3).map((s) => (
          <div key={s.n} className="mb-8">
            <p className="display text-3xl">{String(s.n).padStart(2, "0")} · {s.title}</p>
            <div className="mt-4 h-4 w-3/4 rounded bg-white/10" /><div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
            <div className="mt-4 h-28 rounded-2xl bg-white/5" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 grid place-items-center bg-bg/60 p-5">
        <div className="max-w-md rounded-[24px] border border-accent bg-bg-2 p-6 text-center md:p-8">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-[#111]"><Icon name="Lock" className="h-6 w-6" /></span>
          <h2 className="display mt-5 text-3xl">Free with an account</h2>
          <p className="mt-3 text-mute">Create a free account to open the full guide and all six prompts. It takes under a minute.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/account?next=/portfolio-guide" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111]">Create free account <Icon name="ArrowRight" className="h-4 w-4" /></Link>
            <Link href="/account?mode=login&next=/portfolio-guide" className="inline-flex items-center rounded-full border border-white/25 px-6 py-4 text-sm font-medium hover:border-white/60">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

async function Guide() {
  const me = await currentUser();
  if (!me) return <Locked />;
  return (
    <div className="mt-12">
      <p className="rounded-2xl border border-line bg-bg-2 px-5 py-4 text-mute">Welcome, <span className="text-ink">{me.name.split(" ")[0]}</span>. Work through the steps in order. Copy each prompt with the button, and replace anything in [square brackets] with your own details.</p>
      <ol className="mt-10 space-y-14">
        {guideSteps.map((s) => (
          <li key={s.n} id={`step-${s.n}`} className="scroll-mt-24 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="display block text-6xl text-accent">{String(s.n).padStart(2, "0")}</span>
              <h2 className="display mt-3 text-3xl md:text-4xl">{s.title}</h2>
              {s.body.map((p) => <p key={p} className="mt-3 leading-relaxed text-mute">{p}</p>)}
            </div>
            <div className="space-y-4 lg:col-span-8">
              {s.checklist && (
                <ul className="grid gap-2 rounded-[22px] border border-line bg-bg-2 p-5">
                  {s.checklist.map((c) => <li key={c} className="flex gap-3"><Icon name="Check" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />{c}</li>)}
                </ul>
              )}
              {s.prompts?.map((p) => (
                <div key={p.title} className="overflow-hidden rounded-[22px] border border-line bg-bg-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-sm text-mute">{p.use}</p>
                    </div>
                    <CopyButton text={p.text} label="Copy prompt" />
                  </div>
                  <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap p-5 font-mono text-[13px] leading-relaxed text-ink/90">{p.text}</pre>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-16 grid gap-6 rounded-[28px] bg-accent p-6 text-[#111] md:grid-cols-12 md:p-10">
        <div className="md:col-span-8">
          <h2 className="display text-3xl md:text-4xl">Rather have it built for you?</h2>
          <p className="mt-3 max-w-xl text-lg">Star X Marketing builds portfolio and business websites, then helps you get them seen.</p>
        </div>
        <div className="flex items-end md:col-span-4 md:justify-end">
          <a href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Hi, I'd like Star X to build my portfolio website.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#111] px-6 py-4 text-sm font-semibold text-white">Ask on WhatsApp <Icon name="ArrowRight" className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioGuidePage() {
  return (
    <>
      <main id="main" className="px-5 pb-16 pt-28 md:px-10 md:pt-36">
        <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link href="/" className="hover:text-ink">Home</Link> / Portfolio guide</nav>
        <h1 className="display mt-4 max-w-5xl text-[11vw] leading-[0.98] md:text-[5.2vw]">Build your 3D portfolio with AI</h1>
        <p className="mt-5 max-w-2xl text-lg text-mute md:text-xl">Give the AI your portfolio PDF (or a folder of work) and your CV. Six prompts take you from files on your computer to a live 3D portfolio website on Vercel.</p>
        <Teaser />
        <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-[28px] bg-bg-2" />}>
          <Guide />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
