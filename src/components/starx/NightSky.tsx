"use client";
import { useEffect, useRef, useState } from "react";

type Star = { x: number; y: number; z: number; tw: number; tx: number; ty: number; former: boolean; yellow: boolean; sx: number; sy: number };
type GalaxyDot = { r: number; a: number; s: number };
type Galaxy = { x: number; y: number; R: number; tilt: number; rot: number; speed: number; dots: GalaxyDot[] };

const CYCLE = 15; // seconds per gather → hold → scatter loop
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Opening banner sky: drifting stars, slowly turning galaxies and the odd shooting star.
 * Every cycle part of the stars gather to spell STAR X MARKETING, hold, then drift apart again.
 * Pauses off screen and in background tabs; draws one still frame for reduced motion.
 */
export default function NightSky({ onFormed }: { onFormed?: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [formed, setFormed] = useState(false);

  useEffect(() => {
    const cv = canvas.current; if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: false }); if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = innerWidth < 768;
    let W = 0, H = 0, dpr = 1;
    let stars: Star[] = [], galaxies: Galaxy[] = [];
    let raf = 0, running = false, start = performance.now(), last = start, told = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;

    const textPoints = () => {
      const off = document.createElement("canvas"); off.width = W; off.height = H;
      const o = off.getContext("2d")!;
      const fam = getComputedStyle(document.querySelector(".display") ?? document.body).fontFamily || "sans-serif";
      const big = Math.min(W * (small ? 0.2 : 0.16), H * 0.26);
      o.textAlign = "center"; o.textBaseline = "middle";
      o.font = `800 ${big}px ${fam}`;
      const w1 = o.measureText("STAR ").width, wx = o.measureText("X").width, total = w1 + wx;
      const cy = H * 0.42;
      o.textAlign = "left";
      o.fillStyle = "#fff"; o.fillText("STAR ", W / 2 - total / 2, cy);
      o.fillStyle = "#ff0"; o.fillText("X", W / 2 - total / 2 + w1, cy);
      o.textAlign = "center"; o.fillStyle = "#fff";
      o.font = `700 ${big * 0.34}px ${fam}`;
      if ("letterSpacing" in o) (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${big * 0.06}px`;
      o.fillText("MARKETING", W / 2, cy + big * 0.78);
      const data = o.getImageData(0, 0, W, H).data;
      const gap = small ? 4 : 5;
      const pts: { x: number; y: number; yellow: boolean }[] = [];
      for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) {
        const i = (y * W + x) * 4;
        if (data[i + 3] > 140) pts.push({ x, y, yellow: data[i + 2] < 100 });
      }
      for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
      return pts;
    };

    const build = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pts = textPoints();
      const cap = small ? 900 : 1800;
      const formers = pts.slice(0, cap);
      const free = small ? 220 : 500;
      stars = [];
      for (let i = 0; i < formers.length + free; i++) {
        const f = formers[i];
        stars.push({ x: Math.random() * W, y: Math.random() * H, z: 0.2 + Math.random() * 0.8, tw: Math.random() * Math.PI * 2, tx: f ? f.x : 0, ty: f ? f.y : 0, former: !!f, yellow: !!f?.yellow, sx: 0, sy: 0 });
      }
      stars.forEach((s) => { s.sx = s.x; s.sy = s.y; });
      const mk = (x: number, y: number, R: number, tilt: number, speed: number, n: number): Galaxy => {
        const dots: GalaxyDot[] = [];
        for (let i = 0; i < n; i++) {
          const arm = i % 2, r = Math.pow(Math.random(), 0.7) * R;
          dots.push({ r, a: arm * Math.PI + r / R * 4.2 + (Math.random() - 0.5) * 0.6, s: Math.random() });
        }
        return { x, y, R, tilt, rot: Math.random() * 6, speed, dots };
      };
      galaxies = small
        ? [mk(W * 0.82, H * 0.16, W * 0.22, 0.45, 0.03, 260)]
        : [mk(W * 0.84, H * 0.2, Math.min(W, H) * 0.24, 0.42, 0.025, 700), mk(W * 0.12, H * 0.78, Math.min(W, H) * 0.16, 0.6, -0.035, 420)];
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const t = (now - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.04; pointer.y += (pointer.ty - pointer.y) * 0.04;
      ctx.fillStyle = "#07070b"; ctx.fillRect(0, 0, W, H);

      // galaxies
      for (const g of galaxies) {
        g.rot += g.speed * dt;
        const ox = g.x - pointer.x * 18, oy = g.y - pointer.y * 12;
        for (const d of g.dots) {
          const a = d.a + g.rot * (1.4 - d.r / g.R);
          const x = ox + Math.cos(a) * d.r, y = oy + Math.sin(a) * d.r * g.tilt;
          const core = 1 - d.r / g.R;
          ctx.globalAlpha = 0.15 + core * 0.55 * (0.5 + d.s * 0.5);
          ctx.fillStyle = core > 0.75 ? "#fff3c4" : d.s > 0.7 ? "#c9d4ff" : "#ffffff";
          const sz = 0.6 + core * 1.1;
          ctx.fillRect(x, y, sz, sz);
        }
      }
      ctx.globalAlpha = 1;

      // gather / hold / scatter phases
      const c = (t % CYCLE) / CYCLE;
      let k = 0; // 0 = free, 1 = in the letters
      if (reduce) k = 1;
      else if (c < 0.1) k = 0;
      else if (c < 0.3) k = ease((c - 0.1) / 0.2);
      else if (c < 0.68) k = 1;
      else if (c < 0.86) k = 1 - ease((c - 0.68) / 0.18);
      if (k > 0.98 && !told) { told = true; setFormed(true); onFormed?.(); }

      for (const s of stars) {
        // free drift
        s.sx += 6 * s.z * dt; s.sy += 1.5 * s.z * dt;
        if (s.sx > W + 4) s.sx = -4; if (s.sy > H + 4) s.sy = -4;
        const fx = s.sx - pointer.x * 30 * s.z, fy = s.sy - pointer.y * 20 * s.z;
        let x = fx, y = fy, size = 0.5 + s.z * 1.3, alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1 + s.z * 2) + s.tw));
        if (s.former && k > 0) {
          const jitter = Math.sin(t * 2 + s.tw) * 0.6;
          x = fx + (s.tx + jitter - fx) * k; y = fy + (s.ty - fy) * k;
          size = size + (1.7 - size) * k; alpha = alpha + (1 - alpha) * k;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.former && k > 0.5 && s.yellow ? "#ffd400" : "#ffffff";
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      // occasional shooting star
      if (!reduce) {
        if (!shoot && Math.random() < dt * 0.25) shoot = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.3, vx: 520 + Math.random() * 260, vy: 200 + Math.random() * 120, life: 1 };
        if (shoot) {
          shoot.x += shoot.vx * dt; shoot.y += shoot.vy * dt; shoot.life -= dt * 1.4;
          ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, shoot.life)})`; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - shoot.vx * 0.12, shoot.y - shoot.vy * 0.12); ctx.stroke();
          if (shoot.life <= 0 || shoot.x > W) shoot = null;
        }
      }
    };

    const loop = (now: number) => { draw(now); if (running) raf = requestAnimationFrame(loop); };
    const play = () => { if (running || reduce) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    build();
    if (reduce) { draw(performance.now()); setFormed(true); onFormed?.(); }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? play() : stop()));
    io.observe(cv);
    const vis = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", vis);
    const move = (e: PointerEvent) => { pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5; };
    addEventListener("pointermove", move, { passive: true });
    let rt = 0;
    const resize = () => { clearTimeout(rt); rt = window.setTimeout(() => { build(); if (reduce) draw(performance.now()); }, 200); };
    addEventListener("resize", resize);
    document.fonts?.ready.then(() => { build(); if (reduce) draw(performance.now()); });
    return () => { stop(); io.disconnect(); document.removeEventListener("visibilitychange", vis); removeEventListener("pointermove", move); removeEventListener("resize", resize); clearTimeout(rt); };
  }, [onFormed]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" data-formed={formed || undefined} />;
}
