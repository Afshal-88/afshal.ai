// Reusable reel scenes in the Star X look (dark, #ffd400 accent).
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const FPS = 30;
export const C = { bg: "#0f0f0f", bg2: "#171717", line: "#2a2a2a", ink: "#f5f5f2", mute: "#9a9a96", accent: "#ffd400", green: "#25d366", red: "#ff5a4f" };
export const fontCss = `
@font-face{font-family:Display;src:url(${staticFile("display.woff2")}) format("woff2");font-weight:200 800}
@font-face{font-family:Body;src:url(${staticFile("body.woff2")}) format("woff2");font-weight:200 900}
@font-face{font-family:Mono;src:url(${staticFile("mono.woff2")}) format("woff2");font-weight:100 900}`;

export const pop = (f: number, fps: number, d = 0) => spring({ frame: f - d, fps, config: { damping: 14, stiffness: 180, mass: 0.6 } });
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`, backgroundSize: "54px 54px", backgroundPosition: `0 ${-(f * 0.8) % 54}px`, opacity: 0.55 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 30%, #0f0f0f 85%)" }} />
    </AbsoluteFill>
  );
};

// Big stacked headline; words wrapped in [] are highlighted.
export const Headline: React.FC<{ lines: string[]; size?: number; top?: number }> = ({ lines, size = 140, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: top ? "flex-start" : "center", paddingTop: top, paddingBottom: top ? 0 : 160 }}>
      <div style={{ fontFamily: "Display", fontWeight: 780, color: C.ink, fontSize: size, lineHeight: 0.98, textAlign: "center", letterSpacing: -3 }}>
        {lines.map((l, i) => {
          const s = pop(f, fps, i * 7);
          const hl = l.startsWith("[");
          return (
            <div key={i} style={{ transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`, opacity: s, marginTop: i ? 18 : 0 }}>
              {hl ? <span style={{ background: C.accent, color: "#111", padding: "4px 26px", borderRadius: 22 }}>{l.slice(1, -1)}</span> : l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export type Msg = { from: "them" | "us"; text: string; at: number; meta?: string };
export const Phone: React.FC<{ title: string; time: string; msgs: Msg[]; footer?: string }> = ({ title, time, msgs, footer }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
      <div style={{ width: 760, height: 760, borderRadius: 70, background: "#0b141a", border: "10px solid #222", overflow: "hidden", transform: `translateY(${interpolate(s, [0, 1], [120, 0])}px)`, opacity: s, boxShadow: "0 40px 120px rgba(0,0,0,.6)", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#1f2c34", padding: "34px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: "#3b4a54" }} />
            <div style={{ fontFamily: "Body", fontWeight: 700, fontSize: 36, color: C.ink }}>{title}</div>
          </div>
          <div style={{ fontFamily: "Mono", fontSize: 30, color: C.mute }}>{time}</div>
        </div>
        <div style={{ flex: 1, padding: 30, display: "flex", flexDirection: "column", gap: 18, justifyContent: "flex-end" }}>
          {msgs.map((m, i) => {
            if (f < m.at) return null;
            const p = pop(f, fps, m.at);
            const us = m.from === "us";
            return (
              <div key={i} style={{ alignSelf: us ? "flex-end" : "flex-start", maxWidth: "80%", background: us ? "#005c4b" : "#202c33", color: C.ink, borderRadius: 26, padding: "20px 26px", fontFamily: "Body", fontSize: 36, lineHeight: 1.25, transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, opacity: p, transformOrigin: us ? "right bottom" : "left bottom" }}>
                {m.text}
                {m.meta && <div style={{ fontFamily: "Mono", fontSize: 22, color: "rgba(255,255,255,.55)", marginTop: 8, textAlign: "right" }}>{m.meta}</div>}
              </div>
            );
          })}
        </div>
        {footer && <div style={{ padding: "20px 30px 34px", fontFamily: "Mono", fontSize: 26, color: C.accent, textAlign: "center", letterSpacing: 2 }}>{footer}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const Chips: React.FC<{ items: string[]; step?: number; title?: string; scattered?: boolean }> = ({ items, step = 8, title, scattered }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pos = [[-200, -320, -6], [210, -200, 5], [-170, -40, 4], [220, 120, -5], [-120, 260, 3], [180, 380, -3]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 140 }}>
      {title && <div style={{ position: "absolute", top: 470, fontFamily: "Mono", fontSize: 30, letterSpacing: 5, color: C.accent }}>{title}</div>}
      <div style={{ display: scattered ? "block" : "flex", flexDirection: "column", gap: 22, alignItems: "center", position: "relative" }}>
        {items.map((it, i) => {
          const p = pop(f, fps, i * step);
          const [x, y, r] = pos[i % pos.length];
          const style: React.CSSProperties = scattered ? { position: "absolute", left: x - 180, top: y, transform: `rotate(${r}deg) scale(${interpolate(p, [0, 1], [0.5, 1])})` } : { transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})` };
          return (
            <div key={it} style={{ ...style, opacity: p, whiteSpace: "nowrap", fontFamily: "Body", fontWeight: 800, fontSize: 56, color: C.ink, background: C.bg2, border: `3px solid ${i === items.length - 1 && !scattered ? C.accent : C.line}`, padding: "16px 36px", borderRadius: 999 }}>
              {scattered ? it : `✓ ${it}`}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Sheet: React.FC<{ rows: [string, string][]; highlightCol?: boolean }> = ({ rows, highlightCol }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hl = highlightCol ? interpolate(f, [4, 14], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 140 }}>
      <div style={{ width: 900, background: C.bg2, border: `2px solid ${C.line}`, borderRadius: 32, padding: 34 }}>
        <div style={{ fontFamily: "Mono", fontSize: 26, letterSpacing: 4, color: C.mute, marginBottom: 18 }}>ALL LEADS · ONE SHEET</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "Mono", fontSize: 26, color: C.mute, padding: "10px 0", borderBottom: `2px solid ${C.line}` }}>
          <span>LEAD</span><span style={{ color: hl ? C.accent : C.mute }}>CAME FROM</span>
        </div>
        {rows.map(([a, b], i) => {
          const p = pop(f, fps, highlightCol ? 0 : i * 5);
          return (
            <div key={a} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "Body", fontSize: 40, fontWeight: 700, color: C.ink, padding: "18px 0", borderBottom: `1px solid ${C.line}`, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-60, 0])}px)` }}>
              <span>{a}</span>
              <span style={{ color: "#111", background: `rgba(255,212,0,${hl})`, borderRadius: 12, padding: "0 12px", justifySelf: "start", ...(hl ? {} : { color: C.ink }) }}>{b}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Report: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps);
  const rows = ["Leads", "Sales", "Ad spend"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 140 }}>
      <div style={{ width: 860, background: C.bg2, border: `3px solid ${C.accent}`, borderRadius: 36, padding: 44, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`, opacity: s }}>
        <div style={{ fontFamily: "Mono", fontSize: 28, letterSpacing: 4, color: C.accent }}>MONDAY REPORT</div>
        {rows.map((r, i) => {
          const w = interpolate(f, [10 + i * 10, 30 + i * 10], [0, [70, 45, 58][i]], clamp);
          return (
            <div key={r} style={{ marginTop: 34 }}>
              <div style={{ fontFamily: "Body", fontWeight: 800, fontSize: 48, color: C.ink }}>{r}</div>
              <div style={{ height: 22, background: C.line, borderRadius: 99, marginTop: 12 }}>
                <div style={{ height: 22, width: `${w}%`, background: C.accent, borderRadius: 99 }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Statement: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 160 }}>
      <div style={{ whiteSpace: "pre-line", textAlign: "center", fontFamily: "Display", fontWeight: 800, fontSize: 120, lineHeight: 0.98, letterSpacing: -2, color: "#111", background: C.accent, padding: "26px 50px", borderRadius: 36, transform: `scale(${interpolate(s, [0, 1], [1.4, 1])}) rotate(-1.5deg)`, opacity: s }}>{text}</div>
      {sub && <div style={{ marginTop: 40, fontFamily: "Mono", fontSize: 34, letterSpacing: 5, color: C.ink, opacity: pop(f, fps, 8) }}>{sub}</div>}
    </AbsoluteFill>
  );
};

export const Cta: React.FC<{ top: string; big: string; sub: string }> = ({ top, big, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(f, fps), b = pop(f, fps, 8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 160 }}>
      <div style={{ fontFamily: "Display", fontWeight: 750, color: C.ink, fontSize: 100, opacity: a }}>{top}</div>
      <div style={{ marginTop: 24, fontFamily: "Display", fontWeight: 800, fontSize: big.length > 6 ? 130 : 220, lineHeight: 1, background: C.accent, color: "#111", padding: "14px 50px", borderRadius: 40, textAlign: "center", transform: `scale(${interpolate(b, [0, 1], [1.6, 1])})`, opacity: b }}>{big}</div>
      <div style={{ marginTop: 40, fontFamily: "Body", fontSize: 46, color: C.mute, opacity: b, textAlign: "center" }}>{sub}</div>
    </AbsoluteFill>
  );
};

// Spoken-line captions, current word highlighted (words spread evenly over the line).
export const Caption: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const per = (dur * 0.95) / words.length;
  const idx = Math.min(words.length - 1, Math.floor(f / per));
  const start = Math.floor(idx / 4) * 4;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1300, width: 920, textAlign: "center", fontFamily: "Body", fontWeight: 900, fontSize: 66, lineHeight: 1.12, color: C.ink, textShadow: "0 4px 18px rgba(0,0,0,.85)" }}>
        {words.slice(start, start + 4).map((w, i) => <span key={i} style={{ color: start + i === idx ? C.accent : C.ink }}>{w} </span>)}
      </div>
    </AbsoluteFill>
  );
};

export const TopCard: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 250, whiteSpace: "nowrap", fontFamily: "Display", fontWeight: 750, fontSize: 58, color: "#111", background: C.accent, padding: "12px 30px", borderRadius: 22, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])}) rotate(-1.5deg)`, opacity: s }}>{text}</div>
    </AbsoluteFill>
  );
};
