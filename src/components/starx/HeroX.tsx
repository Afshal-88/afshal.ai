"use client";
import { useEffect, useState, type ComponentType } from "react";
import { X_BOX, X_POLYS } from "./xShape";

/** Flat Star X "X" — shown on phones, with reduced motion, and while the 3D version loads. */
export function FlatX({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`${X_BOX.x} ${X_BOX.y} ${X_BOX.w} ${X_BOX.h}`} className={className} aria-hidden>
      {X_POLYS.map((p, i) => <polygon key={i} points={p.map((q) => q.join(",")).join(" ")} fill="#ffd400" />)}
    </svg>
  );
}

/**
 * Hero visual. Desktops with a mouse load the 3D scene after the page is idle,
 * so it never delays first paint; everyone else keeps the light flat version.
 */
export default function HeroX() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  useEffect(() => {
    const ok = matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    let cancelled = false;
    const load = () => import("./StarX3D").then((m) => { if (!cancelled) setScene(() => m.default); });
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const id = ric ? ric(load, { timeout: 2500 }) : window.setTimeout(load, 1200);
    return () => { cancelled = true; if (!ric) clearTimeout(id); };
  }, []);

  return (
    <div className="relative aspect-square w-full">
      <div className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${Scene ? "opacity-0" : "opacity-100"}`}>
        <FlatX className="starx-float h-[62%] w-auto" />
      </div>
      {Scene && <div className="absolute inset-0 animate-[fadein_1s_ease-out_both]"><Scene /></div>}
    </div>
  );
}
