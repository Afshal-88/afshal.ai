import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/Icon";
import StarField from "@/components/starx/StarField";
import { LockedStep, OpenStep } from "@/components/solutions/StepView";
import { currentUser } from "@/lib/auth";
import { OPEN_STEPS, solutionBySlug, solutions, type Solution } from "@/data/solutions";
import { profile } from "@/data/site";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = solutionBySlug((await params).slug);
  if (!s) return {};
  const title = `${s.title} with AI — step-by-step prompts`;
  const description = `${s.short} ${s.steps.length} steps with ready prompts for ${s.tools.slice(0, 3).join(", ")}. The first ${OPEN_STEPS} are free.`;
  return { title: { absolute: `${title} — Star X Marketing` }, description, alternates: { canonical: `/solutions/${s.slug}` }, openGraph: { title, description, url: `${profile.site}/solutions/${s.slug}`, images: [s.cover] } };
}

async function Locked({ s }: { s: Solution }) {
  const me = await currentUser();
  const rest = s.steps.slice(OPEN_STEPS);
  if (me?.pro) return <ol className="mt-14 space-y-14">{rest.map((x) => <OpenStep key={x.n} s={x} />)}</ol>;
  const next = `/solutions/${s.slug}`;
  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-12">
      <ol className="grid gap-3 lg:col-span-7">{rest.map((x) => <LockedStep key={x.n} s={x} />)}</ol>
      <div className="lg:col-span-5">
        <div className="sticky top-24 rounded-[24px] border border-accent bg-bg-2 p-6 md:p-8">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-[#111]"><Icon name="Unlock" className="h-5 w-5" /></span>
          <h2 className="display mt-5 text-3xl">Unlock the last {rest.length} steps</h2>
          <p className="mt-3 text-mute">These are the steps that finish the job: {rest.map((x) => x.title).join(", ")}.</p>
          <p className="mt-3 text-mute">Pro opens every step in every solution, plus the advanced prompt library. One payment.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={me ? "/pricing" : `/account?next=${encodeURIComponent("/pricing")}`} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111]">{me ? "Get Pro" : "Create account and get Pro"} <Icon name="ArrowRight" className="h-4 w-4" /></Link>
            {!me && <Link href={`/account?mode=login&next=${encodeURIComponent(next)}`} className="inline-flex items-center rounded-full border border-white/25 px-6 py-4 text-sm font-medium hover:border-white/60">Sign in</Link>}
          </div>
          <a href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hi Star X, I'd like you to do this for me: ${s.title}.`)}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-mute underline-offset-4 hover:text-ink hover:underline">Or have Star X do it for you <Icon name="ArrowUpRight" className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  );
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = solutionBySlug((await params).slug);
  if (!s) notFound();
  const others = solutions.filter((x) => x.slug !== s.slug);
  return (
    <>
      <main id="main">
        <section className="relative overflow-hidden px-5 pb-12 pt-28 md:px-10 md:pt-36">
          <StarField />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link href="/" className="hover:text-ink">Home</Link> / <Link href="/solutions" className="hover:text-ink">Build with AI</Link> / {s.title}</nav>
              <h1 className="display mt-4 text-[11vw] leading-[0.98] md:text-[4.6vw]">{s.title}</h1>
              <p className="mt-4 max-w-xl text-lg text-mute">{s.result}</p>
              <ul className="mt-5 flex flex-wrap gap-2">{s.tools.map((t) => <li key={t} className="rounded-full border border-line px-3 py-1 text-sm">{t}</li>)}</ul>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-mute"><Icon name="Unlock" className="h-4 w-4 text-accent" /> Steps 1–{OPEN_STEPS} free · {s.steps.length - OPEN_STEPS} more with Pro</p>
            </div>
            <div className="relative lg:col-span-6">
              <img src={s.cover} alt={s.coverAlt} width={1200} height={800} className="aspect-[4/3] w-full rounded-[24px] border border-line object-cover object-top" />
              {s.gallery && (
                <div className="absolute -bottom-6 -left-4 hidden gap-3 sm:flex">
                  {s.gallery.map((g) => <img key={g.src} src={g.src} alt={g.alt} width={300} height={300} loading="lazy" className="h-28 w-28 rounded-2xl border border-line object-cover object-top shadow-xl md:h-32 md:w-32" />)}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 pt-8 md:px-10">
          <ol className="space-y-14">{s.steps.slice(0, OPEN_STEPS).map((x) => <OpenStep key={x.n} s={x} />)}</ol>
          <Suspense fallback={<div className="mt-14 h-80 animate-pulse rounded-[24px] bg-bg-2" />}><Locked s={s} /></Suspense>
        </section>

        <section className="px-5 pb-20 md:px-10">
          <h2 className="display text-3xl md:text-4xl">More solutions</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/solutions/${o.slug}`} className="group block overflow-hidden rounded-[20px] border border-line bg-bg-2 transition-colors hover:border-accent">
                  <img src={o.cover} alt="" width={600} height={400} loading="lazy" className="aspect-[3/2] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]" />
                  <p className="flex items-center justify-between gap-2 p-4 font-semibold">{o.title} <Icon name="ArrowRight" className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" /></p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
