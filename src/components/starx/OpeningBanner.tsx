"use client";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import NightSky from "./NightSky";
import Icon from "@/components/ui/Icon";
import { ContactButton } from "@/components/ui/ContactModal";

/** Full-screen opening banner: the night sky gathers into the Star X Marketing name. */
export default function OpeningBanner() {
  const [show, setShow] = useState(false);
  const onFormed = useCallback(() => setShow(true), []);
  useEffect(() => { const t = setTimeout(() => setShow(true), 3500); return () => clearTimeout(t); }, []);

  return (
    <section aria-label="Star X Marketing" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#07070b]">
      <NightSky onFormed={onFormed} />
      <p className="sr-only">Star X Marketing</p>
      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-10 text-center md:pb-14"
        initial={{ opacity: 0, y: 24 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        <p className="max-w-xl text-base text-white/75 md:text-lg">Branding · Websites · Social media · Ads · AI automation</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ContactButton className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-[#111] transition-transform active:scale-[0.97]">Start a project <Icon name="ArrowRight" className="h-4 w-4" /></ContactButton>
          <a href="/plan" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-4 text-sm font-medium text-white transition-colors hover:border-white/70">Get your plan in 2 minutes</a>
        </div>
        <a href="#intro" aria-label="Scroll down" className="mt-8 grid h-11 w-7 place-items-start justify-center rounded-full border border-white/30 pt-2">
          <span className="block h-2 w-1 animate-bounce rounded-full bg-white/80" />
        </a>
      </motion.div>
    </section>
  );
}
