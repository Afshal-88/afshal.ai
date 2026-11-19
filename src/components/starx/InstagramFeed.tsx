"use client";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import SocialIcon from "@/components/SocialIcon";
import Lightbox, { type Media } from "./Lightbox";
import { influencers, starx } from "@/data/v2";

/** @starxmarketing posts plus campaign videos, in one grid. Everything opens in a popup. */
export default function InstagramFeed() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const videos: Media[] = influencers.filter((f) => f.video).map((f) => ({ type: "video", src: f.video!, poster: f.poster, alt: f.videoLabel ?? f.name, caption: `${f.name} — ${f.tag.toLowerCase()}` }));
  const posts: Media[] = starx.posts.map((p) => ({ type: "image", src: p.src, alt: p.alt, caption: p.alt.replace(/^Star X post: /, "") }));
  // videos first, then posts: 2 + 7 = a full 3 × 3 grid
  const media = [videos[0], ...posts.slice(0, 3), videos[1], ...posts.slice(3)].filter(Boolean) as Media[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-[24px] border border-line bg-bg-2 p-5 md:p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-accent p-[3px]">
            <span className="grid h-full w-full place-items-center rounded-full bg-[#111]"><img src="/brand/starx-logo-sm.webp" alt="" width={170} height={96} className="h-6 w-auto" /></span>
          </span>
          <div>
            <p className="text-lg font-semibold">{starx.handle}</p>
            <p className="text-sm text-mute">Star X Marketing on Instagram</p>
          </div>
        </div>
        <a href={starx.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-accent hover:text-[#111]"><SocialIcon name="instagram" className="h-4 w-4" /> Follow on Instagram</a>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {media.map((m, i) => (
          <motion.li key={m.src} initial={reduce ? false : { opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-6% 0px" }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: (i % 3) * 0.06 }}>
            <button onClick={() => setOpen(i)} aria-label={m.type === "video" ? `Play: ${m.alt}` : `Open post: ${m.alt}`} className="group relative block w-full overflow-hidden rounded-[18px] border border-line bg-black">
              <img src={m.type === "video" ? m.poster : m.src} alt={m.alt} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.05]" />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
              {m.type === "video" ? (
                <>
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs"><Icon name="Film" className="h-3.5 w-3.5" /> Video</span>
                  <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[#111] transition-transform duration-300 group-hover:scale-110"><Icon name="Play" className="ml-0.5 h-6 w-6" /></span>
                </>
              ) : (
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><Icon name="ArrowUpRight" className="h-4 w-4" /></span>
              )}
            </button>
          </motion.li>
        ))}
      </ul>
      <Lightbox items={media} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </div>
  );
}
