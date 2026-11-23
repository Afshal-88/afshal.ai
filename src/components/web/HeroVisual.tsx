"use client";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const ease = [0.23, 1, 0.32, 1] as const;

/**
 * Homepage hero picture: a large studio photo with two smaller photos floating over it.
 * Layers drift at different speeds on scroll and follow the mouse slightly.
 */
export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yMain = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);
  const yA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -90]);
  const yB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-20, 60]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 }), sy = useSpring(my, { stiffness: 120, damping: 18 });
  const ax = useTransform(sx, (v) => v * 18), ay = useTransform(sy, (v) => v * 14);
  const bx = useTransform(sx, (v) => v * -14), by = useTransform(sy, (v) => v * -10);
  const aY = useTransform(() => yA.get() + ay.get());
  const bY = useTransform(() => yB.get() + by.get());

  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0); }} className="relative mx-auto w-full max-w-[720px] pb-10 pt-6 lg:pb-14">
      <motion.div style={{ y: yMain }} initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease }}
        className="relative overflow-hidden rounded-[28px] border border-line shadow-2xl">
        <img src="/visuals/website-studio.webp" alt="A website design studio at night (AI-generated illustration)" width={1800} height={1011} fetchPriority="high" className="aspect-[16/10] w-full object-cover" />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,15,15,.45),transparent_50%)]" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#111]/80 px-3 py-1.5 text-xs font-medium text-white md:left-5 md:top-5 md:text-sm">
          <span className="h-2 w-2 rounded-full bg-accent" /> Websites · Shopify · Apps
        </span>
      </motion.div>

      <motion.div style={{ y: aY, x: ax }} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.35, ease }}
        className="absolute -bottom-2 -left-3 w-[38%] overflow-hidden rounded-[20px] border-4 border-bg shadow-2xl md:-left-8">
        <img src="/visuals/mobile-apps.webp" alt="Mobile app screens (AI-generated illustration)" width={1100} height={825} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </motion.div>

      <motion.div style={{ y: bY, x: bx }} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5, ease }}
        className="absolute -right-3 top-0 hidden w-[34%] overflow-hidden rounded-[20px] border-4 border-bg shadow-2xl sm:block md:-right-8">
        <img src="/visuals/ecommerce.webp" alt="An online store order being packed (AI-generated illustration)" width={1100} height={825} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </motion.div>
    </div>
  );
}
