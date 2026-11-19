"use client";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import Icon from "@/components/ui/Icon";

export type Media = { type: "image" | "video"; src: string; alt: string; caption?: string; poster?: string };

/** Full-screen popup for images and videos, with arrows, swipe-free keyboard nav and Esc to close. */
export default function Lightbox({ items, index, onClose, onIndex }: { items: Media[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const go = useCallback((d: number) => { if (index === null) return; onIndex((index + d + items.length) % items.length); }, [index, items.length, onIndex]);
  useEffect(() => {
    if (index === null) return;
    window.__lenis?.stop();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    addEventListener("keydown", k);
    return () => { removeEventListener("keydown", k); window.__lenis?.start(); };
  }, [index, go, onClose]);

  const m = index === null ? null : items[index];
  return (
    <AnimatePresence>
      {m && (
        <motion.div role="dialog" aria-modal="true" aria-label={m.alt} className="fixed inset-0 z-[100] flex flex-col bg-black/92" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div className="flex items-center justify-between px-5 py-4 text-sm text-white/70">
            <span className="tabular-nums">{index! + 1} / {items.length}</span>
            <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white hover:border-white/60"><Icon name="X" className="h-5 w-5" /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20" onClick={(e) => e.stopPropagation()}>
            <motion.div key={m.src} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }} className="flex max-h-full max-w-full flex-col items-center">
              {m.type === "video"
                ? <video src={m.src} poster={m.poster} controls autoPlay playsInline className="max-h-[78vh] max-w-full rounded-xl bg-black" />
                : <img src={m.src} alt={m.alt} className="max-h-[78vh] max-w-full rounded-xl object-contain" />}
              {m.caption && <p className="mt-3 max-w-2xl text-center text-sm text-white/75">{m.caption}</p>}
            </motion.div>
            {items.length > 1 && (
              <>
                <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-accent hover:text-[#111] md:left-6"><Icon name="ChevronLeft" className="h-6 w-6" /></button>
                <button onClick={() => go(1)} aria-label="Next" className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-accent hover:text-[#111] md:right-6"><Icon name="ChevronRight" className="h-6 w-6" /></button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
