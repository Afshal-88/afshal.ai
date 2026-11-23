"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Icon from "@/components/ui/Icon";

export type IndexItem = { name: string; type: string; img?: string; href: string; external: boolean };

/** All websites as a numbered list. On desktop a preview follows the cursor over each row. */
export default function SiteIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [fine, setFine] = useState(false);
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => { setFine(!matchMedia("(hover: none) and (pointer: coarse)").matches); }, []);

  const move = (e: React.PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
  const cur = active !== null ? items[active] : null;

  return (
    <div onPointerMove={fine ? move : undefined} onPointerLeave={() => setActive(null)} className="relative">
      <ul className="border-b border-line">
        {items.map((it, i) => {
          const row = (
            <>
              <span className="label w-10 shrink-0 text-dim md:w-16">{String(i + 1).padStart(2, "0")}</span>
              {it.img && <img src={it.img} alt="" width={96} height={64} loading="lazy" className="h-12 w-16 shrink-0 rounded-lg object-cover object-top md:hidden" />}
              <span className="min-w-0 flex-1">
                <span className="display block text-xl leading-tight md:truncate md:text-5xl transition-[transform,color] duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:translate-x-3 group-hover:text-accent">{it.name}</span>
                <span className="mt-1 block text-sm text-mute md:hidden">{it.type}</span>
              </span>
              <span className="hidden w-[32%] shrink-0 text-mute md:block">{it.type}</span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#111] md:h-12 md:w-12"><Icon name="ArrowUpRight" className="h-4 w-4" /></span>
            </>
          );
          const cls = "group flex items-center gap-4 border-t border-line py-5 md:gap-6 md:py-7";
          return (
            <li key={it.name} onPointerEnter={() => setActive(it.img ? i : null)}>
              {it.external ? <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>{row}</a> : <Link href={it.href} className={cls}>{row}</Link>}
            </li>
          );
        })}
      </ul>

      {fine && (
        <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-40">
          <AnimatePresence>
            {cur?.img && (
              <motion.div key={cur.img} initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 shadow-2xl" style={{ width: 380, height: 250 }}>
                <img src={cur.img} alt="" className="h-full w-full object-cover object-top" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
