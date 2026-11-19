"use client";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { websites } from "@/data/v2";

/** Live website previews: each full-page screenshot scrolls inside a browser frame. */
export default function WorkShowcase() {
  const reduce = useReducedMotion();
  const list = websites.filter((w) => w.desktop);
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {list.map((w, i) => {
        const tall = !!w.mobile; // stitched full-page captures scroll; single-screen shots stay still
        const href = w.slug ? `/work/${w.slug}` : `https://${w.domain}`;
        const external = !w.slug;
        const card = (
          <>
            <div className="overflow-hidden rounded-t-[22px] border-b border-line bg-[#1d1d1d]">
              <div className="flex items-center gap-1.5 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 truncate rounded-full bg-white/5 px-3 py-0.5 text-xs text-mute">{w.domain}</span>
              </div>
              <div className="scroll-frame relative aspect-[16/11] w-full overflow-hidden bg-white [container-type:size]">
                <img src={w.desktop} alt={`${w.name} website`} loading="lazy" decoding="async" className={tall ? "scroll-shot block w-full" : "h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.04]"} style={tall ? { animationDelay: `${i * -2.5}s` } : undefined} />
              </div>
            </div>
            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <h3 className="text-lg font-semibold">{w.name}</h3>
                <p className="mt-1 text-sm text-mute">{w.type}</p>
                <p className="mt-3 flex flex-wrap gap-1.5">{w.stack.slice(0, 3).map((s) => <span key={s} className="rounded-full border border-line px-2.5 py-1 text-xs text-mute">{s}</span>)}</p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#111]"><Icon name="ArrowUpRight" className="h-4 w-4" /></span>
            </div>
          </>
        );
        const cls = "group block h-full rounded-[24px] border border-line bg-bg-2 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/30";
        return (
          <motion.li key={w.name} initial={reduce ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: (i % 3) * 0.08 }}>
            {external ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{card}</a> : <Link href={href} className={cls}>{card}</Link>}
          </motion.li>
        );
      })}
    </ul>
  );
}
