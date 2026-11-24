import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "./words.json";

const FPS = 30;
const VO_END = 48.9;
const END = 51.8;
export const totalFrames = Math.round(END * FPS);
const C = { ink: "#fff", accent: "#ffd400", dark: "rgba(12,12,12,0.78)" };
const f = (s: number) => Math.round(s * FPS);

const fontCss = `
@font-face{font-family:Display;src:url(${staticFile("display.woff2")}) format("woff2");font-weight:200 800}
@font-face{font-family:Body;src:url(${staticFile("body.woff2")}) format("woff2");font-weight:200 900}
@font-face{font-family:Mono;src:url(${staticFile("mono.woff2")}) format("woff2");font-weight:100 900}`;

type W = { t: string; s: number; e: number };
const WORDS = words as W[];

// "Camera cuts": alternate wide and close framing at each new sentence.
const CUTS: { at: number; zoom: number }[] = [
  { at: 0, zoom: 1.32 }, { at: 5.85, zoom: 1.0 }, { at: 16.1, zoom: 1.22 }, { at: 27.45, zoom: 1.0 },
  { at: 38.8, zoom: 1.3 }, { at: 43.75, zoom: 1.08 },
];
// Face position inside the 1080x1920 cover-cropped frame (used as zoom origin).
const FACE = { x: 545, y: 640 };

type Item = { at: number; label: string };
const GROUPS: { from: number; to: number; title: string; items: Item[] }[] = [
  { from: 7.7, to: 16.0, title: "AI CAN AUTOMATE", items: [
    { at: 7.87, label: "Social media" }, { at: 9.0, label: "Content" }, { at: 10.4, label: "Scheduling" },
    { at: 10.93, label: "Customer replies" }, { at: 12.0, label: "Lead generation" }, { at: 12.8, label: "Email" },
    { at: 14.35, label: "SEO" }, { at: 15.17, label: "Paid ads" } ] },
  { from: 18.9, to: 27.3, title: "WITH AI TOOLS", items: [
    { at: 19.05, label: "Audience behaviour" }, { at: 20.6, label: "Potential customers" },
    { at: 22.27, label: "Personalised strategy" }, { at: 24.8, label: "Real-time data" } ] },
  { from: 27.6, to: 38.7, title: "THE RESULT", items: [
    { at: 27.85, label: "Automated leads" }, { at: 29.97, label: "AI content" }, { at: 31.5, label: "Performance tracking" },
    { at: 33.5, label: "Less manual work" }, { at: 34.67, label: "Save time" }, { at: 35.45, label: "Lower costs" } ] },
];
const STATEMENTS = [
  { from: 40.55, to: 43.75, text: "NOT JUST\nUSING AI" },
  { from: 43.75, to: VO_END, text: "BUILD SYSTEMS\nTHAT NEVER STOP" },
];

const Photo: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  let idx = 0;
  CUTS.forEach((c, i) => { if (t >= c.at) idx = i; });
  const cut = CUTS[idx];
  const local = t - cut.at;
  // slow push in on every shot + a gentle handheld drift
  const push = cut.zoom * (1 + local * 0.006);
  const dx = Math.sin(t * 0.7) * 6, dy = Math.cos(t * 0.53) * 5;
  const endFade = interpolate(t, [VO_END, VO_END + 0.5], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img src={staticFile("desk.png")} style={{
        position: "absolute", height: 1920, width: 1757, left: -338, top: 0, objectFit: "cover",
        transformOrigin: `${FACE.x + 338}px ${FACE.y}px`, transform: `translate(${dx}px, ${dy}px) scale(${push})`,
        filter: "contrast(1.05) saturate(1.06)", opacity: endFade,
      }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(0,0,0,.55) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.45), transparent 22%, transparent 55%, rgba(0,0,0,.7))" }} />
    </AbsoluteFill>
  );
};

const pop = (fr: number, fps: number, d = 0) => spring({ frame: fr - d, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });

const Group: React.FC<{ g: (typeof GROUPS)[number] }> = ({ g }) => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = g.from + fr / FPS;
  const inS = pop(fr, fps);
  const out = interpolate(t, [g.to - 0.25, g.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 860, width: 940, background: C.dark, borderRadius: 34, padding: "26px 30px 30px", border: "2px solid rgba(255,255,255,.12)", opacity: out * inS, transform: `translateY(${interpolate(inS, [0, 1], [40, 0])}px)` }}>
        <div style={{ fontFamily: "Mono", fontSize: 26, letterSpacing: 4, color: C.accent, marginBottom: 16 }}>{g.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {g.items.map((it) => {
            const s = pop(fr, fps, f(it.at - g.from));
            if (t < it.at) return null;
            const latest = g.items.filter((x) => x.at <= t).slice(-1)[0] === it;
            return (
              <div key={it.label} style={{ fontFamily: "Body", fontWeight: 800, fontSize: 40, padding: "10px 22px", borderRadius: 999, color: latest ? "#111" : C.ink, background: latest ? C.accent : "rgba(255,255,255,.1)", transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s }}>
                ✓ {it.label}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Statement: React.FC<{ text: string }> = ({ text }) => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(fr, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 930, textAlign: "center", whiteSpace: "pre-line", fontFamily: "Display", fontWeight: 800, fontSize: 104, lineHeight: 0.98, letterSpacing: -2, color: "#111", background: C.accent, padding: "18px 40px", borderRadius: 30, transform: `scale(${interpolate(s, [0, 1], [1.4, 1])}) rotate(-1.5deg)`, opacity: s }}>{text}</div>
    </AbsoluteFill>
  );
};

// Word-by-word subtitles from the real transcript timings.
const CHUNKS: W[][] = (() => {
  const out: W[][] = [];
  let cur: W[] = [];
  WORDS.forEach((w) => {
    cur.push(w);
    if (cur.length >= 4 || /[.,]$/.test(w.t)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
})();

const Subtitles: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  if (t > VO_END) return null;
  let ci = -1;
  CHUNKS.forEach((c, i) => { if (t >= c[0].s - 0.05) ci = i; });
  if (ci < 0) return null;
  const chunk = CHUNKS[ci];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1330, width: 960, textAlign: "center", fontFamily: "Body", fontWeight: 900, fontSize: 70, lineHeight: 1.1, textTransform: "uppercase", WebkitTextStroke: "2px rgba(0,0,0,.6)", textShadow: "0 6px 20px rgba(0,0,0,.9)" }}>
        {chunk.map((w, i) => {
          const on = t >= w.s - 0.03;
          const active = on && (i === chunk.length - 1 || t < chunk[i + 1].s - 0.03);
          return <span key={i} style={{ color: active ? C.accent : on ? C.ink : "rgba(255,255,255,.55)" }}>{w.t.replace(/[.,]$/, "")} </span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(fr, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 930, textAlign: "center", fontFamily: "Display", fontWeight: 800, fontSize: 88, lineHeight: 1, color: "#111", background: C.accent, padding: "16px 34px", borderRadius: 26, transform: `scale(${interpolate(s, [0, 1], [1.5, 1])}) rotate(-1.5deg)` }}>
        STILL DOING<br />MARKETING BY HAND?
      </div>
    </AbsoluteFill>
  );
};

const LowerThird: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(fr, fps);
  const out = interpolate(fr, [f(3.0), f(3.3)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 60, top: 1130, opacity: out, transform: `translateX(${interpolate(s, [0, 1], [-80, 0])}px)` }}>
      <div style={{ fontFamily: "Display", fontWeight: 800, fontSize: 56, color: C.ink, textShadow: "0 4px 16px rgba(0,0,0,.8)" }}>Afshal Amir</div>
      <div style={{ marginTop: 6, fontFamily: "Body", fontWeight: 700, fontSize: 32, color: "#111", background: C.accent, padding: "4px 14px", borderRadius: 8, display: "inline-block" }}>Marketing Director · Star X Marketing</div>
    </div>
  );
};

const EndCard: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(fr, fps), b = pop(fr, fps, 8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,.55)" }}>
      <div style={{ fontFamily: "Display", fontWeight: 750, fontSize: 100, color: C.ink, opacity: a }}>Comment</div>
      <div style={{ marginTop: 20, fontFamily: "Display", fontWeight: 800, fontSize: 240, lineHeight: 1, background: C.accent, color: "#111", padding: "10px 60px", borderRadius: 40, transform: `scale(${interpolate(b, [0, 1], [1.6, 1])})`, opacity: b }}>AI</div>
      <div style={{ marginTop: 40, maxWidth: 860, textAlign: "center", fontFamily: "Body", fontWeight: 700, fontSize: 46, color: C.ink, opacity: b }}>to see what's coming to<br />Star X Marketing</div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <style>{fontCss}</style>
    <Photo />
    <Audio src={staticFile("vo.wav")} />
    <div style={{ position: "absolute", left: 60, top: 160, fontFamily: "Mono", fontSize: 28, letterSpacing: 4, color: "rgba(255,255,255,.85)" }}>STAR X MARKETING · COMING SOON</div>
    <Sequence from={0} durationInFrames={f(2.9)}><Hook /></Sequence>
    <Sequence from={f(2.9)} durationInFrames={f(3.4)}><LowerThird /></Sequence>
    {GROUPS.map((g) => (
      <Sequence key={g.title} from={f(g.from)} durationInFrames={f(g.to - g.from)}><Group g={g} /></Sequence>
    ))}
    {STATEMENTS.map((s) => (
      <Sequence key={s.text} from={f(s.from)} durationInFrames={f(s.to - s.from)}><Statement text={s.text} /></Sequence>
    ))}
    <Subtitles />
    <Sequence from={f(VO_END)}><EndCard /></Sequence>
  </AbsoluteFill>
);
