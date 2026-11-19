"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Lightbox, { type Media } from "./Lightbox";
import { creative } from "@/data/site";

const tabs = creative.filter((c) => c.key !== "logos");

/** Design work by category; every image opens in a popup. */
export default function DesignGallery() {
  const [tab, setTab] = useState(tabs[0].key);
  const [open, setOpen] = useState<number | null>(null);
  const group = tabs.find((t) => t.key === tab)!;
  const media: Media[] = group.items.map((w) => ({ type: "image", src: w.src, alt: w.alt, caption: w.title }));

  return (
    <div>
      <div role="tablist" aria-label="Design categories" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={`h-11 rounded-full border px-5 text-sm transition-colors ${tab === t.key ? "border-accent bg-accent font-semibold text-[#111]" : "border-line text-mute hover:border-white/40 hover:text-ink"}`}>
            {t.label} <span className="ml-1 opacity-60">{t.items.length}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.ul key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }} className="mt-6 grid gap-4 sm:grid-cols-2">
          {group.items.map((w, i) => (
            <li key={w.src} className={group.items.length % 2 === 1 && i === 0 ? "sm:col-span-2" : ""}>
              <button onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-[22px] border border-line bg-bg-2 text-left">
                <img src={w.src} alt={w.alt} loading="lazy" decoding="async" width={1600} height={900} className="aspect-video w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.04]" />
                <span className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-black/75 px-4 py-2.5 text-sm">
                  {w.title}
                  <Icon name="ArrowUpRight" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <Lightbox items={media} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </div>
  );
}
