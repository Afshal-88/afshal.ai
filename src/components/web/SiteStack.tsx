"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Icon from "@/components/ui/Icon";

export type StackSite = { name: string; domain: string; type: string; desktop: string; mobile?: string; stack: string[]; href: string; external: boolean };

/**
 * Featured websites as full-width cards that pin and stack while you scroll:
 * each card stays in place and shrinks slightly as the next one slides over it.
 */
export default function SiteStack({ sites }: { sites: StackSite[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="relative">
      {sites.map((s, i) => (
        <Card key={s.name} s={s} i={i} n={sites.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function Card({ s, i, n, progress }: { s: StackSite; i: number; n: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const scale = useTransform(progress, [i / n, 1], [1, reduce ? 1 : 1 - (n - i) * 0.035]);
  const dim = useTransform(progress, [i / n, Math.min(1, (i + 1) / n)], [0, reduce || i === n - 1 ? 0 : 0.45]);
  const body = (
    <>
      <div className="flex flex-col justify-between gap-6 p-6 md:p-10 lg:col-span-5">
        <div>
          <p className="label text-dim">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
          <h3 className="display mt-4 text-4xl leading-[0.95] md:text-6xl">{s.name}</h3>
          <p className="mt-3 text-mute md:text-lg">{s.type}</p>
          <ul className="mt-5 flex flex-wrap gap-2">{s.stack.map((t) => <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-mute md:text-sm">{t}</li>)}</ul>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg transition-colors group-hover:bg-accent group-hover:text-[#111]">
          {s.external ? `Visit ${s.domain}` : "Open case study"} <Icon name="ArrowUpRight" className="h-4 w-4" />
        </span>
      </div>
      <div className="relative min-h-0 flex-1 px-4 pb-4 md:px-6 md:pb-6 lg:col-span-7 lg:py-6 lg:pl-0">
        <div className="h-full overflow-hidden rounded-[20px] border border-line bg-[#1d1d1d]">
          <div className="flex items-center gap-1.5 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 truncate rounded-full bg-white/5 px-3 py-0.5 text-xs text-mute">{s.domain}</span>
          </div>
          <div className="scroll-frame relative h-[calc(100%-2.25rem)] w-full overflow-hidden bg-white [container-type:size]">
            <img src={s.desktop} alt={`${s.name} website, desktop`} loading="lazy" decoding="async" className={s.mobile ? "scroll-shot block w-full" : "h-full w-full object-cover object-top"} style={{ animationDelay: `${i * -3}s` }} />
          </div>
        </div>
        {s.mobile && (
          <div className="absolute bottom-8 right-8 hidden w-[22%] overflow-hidden rounded-[22px] border-[5px] border-[#222] bg-white shadow-2xl md:block">
            <div className="scroll-frame relative aspect-[9/19] overflow-hidden [container-type:size]">
              <img src={s.mobile} alt={`${s.name} website, phone`} loading="lazy" decoding="async" className="scroll-shot block w-full" style={{ animationDelay: `${i * -3 - 6}s` }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
  const cls = "group flex h-full flex-col overflow-hidden rounded-[32px] border border-line bg-bg-2 lg:grid lg:grid-cols-12";
  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center">
      <motion.div style={{ scale, top: `calc(${i * 18}px)` }} className="relative h-[80svh] max-h-[760px] w-full origin-top">
        {s.external ? <a href={s.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a> : <Link href={s.href} className={cls}>{body}</Link>}
        <motion.span aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 rounded-[32px] bg-black" />
      </motion.div>
    </div>
  );
}
