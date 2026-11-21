"use client";
import { useEffect, useRef } from "react";

/**
 * Light background of drifting, twinkling stars for any section.
 * Place inside a `relative overflow-hidden` parent. Pauses when off screen;
 * draws one still frame for people who prefer reduced motion.
 */
export default function StarField({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, on = false;
    let stars: { x: number; y: number; r: number; tw: number; sp: number; gold: boolean }[] = [];

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const b = cv.getBoundingClientRect();
      W = b.width; H = b.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(((W * H) / 9000) * density);
      stars = Array.from({ length: Math.min(n, 400) }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + 0.3,
        tw: Math.random() * Math.PI * 2, sp: Math.random() * 0.06 + 0.02, gold: Math.random() < 0.08,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        if (!reduce) { s.x -= s.sp; if (s.x < -2) s.x = W + 2; }
        const a = reduce ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 900 + s.tw));
        ctx.globalAlpha = a;
        ctx.fillStyle = s.gold ? "#ffd400" : "#ffffff";
        ctx.fillRect(s.x, s.y, s.r * 1.6, s.r * 1.6);
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => { draw(t); if (on) raf = requestAnimationFrame(loop); };
    const start = () => { if (on || reduce || document.hidden) return; on = true; raf = requestAnimationFrame(loop); };
    const stop = () => { on = false; cancelAnimationFrame(raf); };

    size(); draw(0);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    io.observe(cv);
    const ro = new ResizeObserver(() => { size(); draw(performance.now()); });
    ro.observe(cv);
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", vis);
    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
