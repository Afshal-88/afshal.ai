// Colourful, high-motion reel style: moving colour blobs, flash wipes, glitch hook,
// glowing phone frame with a real screen recording, word-timed pill captions.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FPS, fontCss } from "./kit";

export const PAL = ["#ffd400", "#ff3d81", "#22d3ee", "#8b5cf6", "#34d399"];
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const pop = (f: number, fps: number, d = 0) => spring({ frame: f - d, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });

export const ColorBg: React.FC = () => {
  const f = useCurrentFrame();
  const blobs = [
    { c: PAL[1], x: 20, y: 18, r: 46, sp: 0.013 },
    { c: PAL[2], x: 80, y: 30, r: 42, sp: 0.017 },
    { c: PAL[3], x: 30, y: 78, r: 50, sp: 0.011 },
    { c: PAL[0], x: 78, y: 82, r: 36, sp: 0.019 },
  ];
  return (
    <AbsoluteFill style={{ background: "#0b0b12", overflow: "hidden" }}>
      {blobs.map((b, i) => {
        const x = b.x + Math.sin(f * b.sp + i) * 14, y = b.y + Math.cos(f * b.sp * 1.3 + i * 2) * 10;
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: `${b.r * 2}vw`, height: `${b.r * 2}vw`, marginLeft: `-${b.r}vw`, marginTop: `-${b.r}vw`, borderRadius: "50%", background: b.c, opacity: 0.55, filter: "blur(140px)" }} />;
      })}
      <AbsoluteFill style={{ filter: `hue-rotate(${(f * 1.2) % 360}deg)`, background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(11,11,18,.65) 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.07) 2px, transparent 2px)", backgroundSize: "48px 48px", backgroundPosition: `0 ${(-f * 1.2) % 48}px` }} />
    </AbsoluteFill>
  );
};

// Diagonal colour bars that sweep across at a cut.
export const FlashWipe: React.FC<{ seed: number }> = ({ seed }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {[0, 1, 2].map((k) => {
        const x = interpolate(f, [k * 2, 9 + k * 2], [-140, 140], cl);
        return <div key={k} style={{ position: "absolute", top: "-20%", left: `${x}%`, width: "55%", height: "140%", background: PAL[(seed + k) % PAL.length], transform: "skewX(-18deg)", opacity: 0.95 }} />;
      })}
    </AbsoluteFill>
  );
};

export const Glitch: React.FC<{ lines: string[]; size?: number; delay?: number }> = ({ lines, size = 124, delay = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const j = f % 9 < 2 ? 10 : 3;
  return (
    <div style={{ fontFamily: "Display", fontWeight: 800, fontSize: size, lineHeight: 0.98, letterSpacing: -3, color: "#fff", textAlign: "center", textTransform: "uppercase" }}>
      {lines.map((l, i) => {
        const s = pop(f, fps, delay + i * 6);
        return (
          <div key={i} style={{ opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.6, 1])}) rotate(${(i % 2 ? 1 : -1) * 1.5}deg)`, textShadow: `${j}px 0 ${PAL[1]}, ${-j}px 0 ${PAL[2]}`, marginTop: i ? 16 : 0 }}>
            {l.startsWith("[") ? <span style={{ background: `linear-gradient(90deg, ${PAL[0]}, ${PAL[1]}, ${PAL[3]})`, color: "#111", padding: "2px 26px", borderRadius: 24, textShadow: "none" }}>{l.slice(1, -1)}</span> : l}
          </div>
        );
      })}
    </div>
  );
};

export const GlowPhone: React.FC<{ rec: string; src: [number, number]; dur: number; badge: string; url?: string }> = ({ rec, src, dur, badge, url }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps);
  const rate = Math.min(3, Math.max(0.6, (src[1] - src[0]) / (dur / FPS)));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300 }}>
      <div style={{ position: "relative", width: 680, height: 1209, borderRadius: 80, padding: 12, background: `conic-gradient(from ${f * 6}deg, ${PAL.join(", ")}, ${PAL[0]})`, boxShadow: `0 0 90px ${PAL[(Math.floor(f / 20)) % PAL.length]}88`, transform: `translateY(${interpolate(s, [0, 1], [200, 0])}px) rotate(${interpolate(s, [0, 1], [-6, 0])}deg) scale(${interpolate(s, [0, 1], [0.85, 1])})` }}>
        <div style={{ width: 656, height: 1185, borderRadius: 70, overflow: "hidden", background: "#000", position: "relative" }}>
          <OffthreadVideo src={staticFile(rec)} startFrom={Math.round(src[0] * FPS)} playbackRate={rate} muted style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scale(0.6074)", transformOrigin: "0 0" }} />
        </div>
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14, background: "#111", border: `3px solid ${PAL[0]}`, color: "#fff", fontFamily: "Mono", fontSize: 30, letterSpacing: 3, padding: "12px 26px", borderRadius: 999 }}>
          <span style={{ width: 18, height: 18, borderRadius: 99, background: "#ff3b3b", opacity: f % 30 < 15 ? 1 : 0.3 }} />{badge}
        </div>
        {url && <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", background: PAL[0], color: "#111", fontFamily: "Body", fontWeight: 800, fontSize: 36, padding: "10px 26px", borderRadius: 999 }}>{url}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const FileToSite: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(f, fps), b = pop(f, fps, 6), c = pop(f, fps, 16), d = pop(f, fps, 26);
  const doc = (label: string, color: string, s: number, rot: number) => (
    <div style={{ width: 230, height: 290, borderRadius: 26, background: "#fff", position: "relative", transform: `scale(${s}) rotate(${rot}deg)`, boxShadow: `0 20px 60px ${color}66` }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, background: color, borderBottomLeftRadius: 26, borderTopRightRadius: 26 }} />
      {[60, 100, 140, 180].map((y) => <div key={y} style={{ position: "absolute", left: 30, top: y, width: 150, height: 14, borderRadius: 8, background: "#ddd" }} />)}
      <div style={{ position: "absolute", bottom: 22, left: 30, fontFamily: "Display", fontWeight: 800, fontSize: 52, color }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260, gap: 50 }}>
      <div style={{ display: "flex", gap: 40 }}>{doc("PDF", PAL[1], a, -6)}{doc("CV", PAL[2], b, 5)}</div>
      <div style={{ fontFamily: "Display", fontSize: 110, color: "#fff", opacity: c, transform: `translateY(${interpolate(c, [0, 1], [-30, 0])}px)` }}>↓</div>
      <div style={{ fontFamily: "Display", fontWeight: 800, fontSize: 80, padding: "18px 44px", borderRadius: 30, color: "#111", background: `linear-gradient(90deg, ${PAL[0]}, ${PAL[4]})`, transform: `scale(${d})` }}>+ AI</div>
    </AbsoluteFill>
  );
};

export const BigNumber: React.FC<{ n: string; label: string; chips: string[] }> = ({ n, label, chips }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 280 }}>
      <div style={{ fontFamily: "Display", fontWeight: 800, fontSize: 420, lineHeight: 0.9, color: PAL[Math.floor(f / 8) % PAL.length], textShadow: `10px 10px 0 ${PAL[(Math.floor(f / 8) + 2) % PAL.length]}`, transform: `scale(${interpolate(s, [0, 1], [2, 1])})` }}>{n}</div>
      <div style={{ fontFamily: "Display", fontWeight: 800, fontSize: 84, color: "#fff", marginTop: -10, opacity: s }}>{label}</div>
      <div style={{ display: "flex", gap: 18, marginTop: 40 }}>
        {chips.map((c, i) => { const p = pop(f, fps, 10 + i * 7); return <div key={c} style={{ fontFamily: "Body", fontWeight: 800, fontSize: 44, color: "#111", background: PAL[(i + 2) % PAL.length], padding: "12px 28px", borderRadius: 999, transform: `scale(${p})` }}>{c}</div>; })}
      </div>
    </AbsoluteFill>
  );
};

export const BrowserLink: React.FC<{ text: string; chips: string[] }> = ({ text, chips }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = text.slice(0, Math.floor(f / 1.6));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 280 }}>
      <div style={{ width: 900, background: "#15151f", borderRadius: 34, border: "3px solid rgba(255,255,255,.15)", overflow: "hidden", transform: `scale(${pop(f, fps)})` }}>
        <div style={{ display: "flex", gap: 14, padding: 26, background: "#1d1d2a" }}>{[PAL[1], PAL[0], PAL[4]].map((c) => <span key={c} style={{ width: 24, height: 24, borderRadius: 99, background: c }} />)}</div>
        <div style={{ padding: "40px 36px", fontFamily: "Mono", fontSize: 50, color: "#fff" }}>🔒 {shown}<span style={{ opacity: f % 20 < 10 ? 1 : 0, color: PAL[0] }}>|</span></div>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 50 }}>
        {chips.map((c, i) => { const p = pop(f, fps, 14 + i * 7); return <div key={c} style={{ fontFamily: "Body", fontWeight: 800, fontSize: 46, color: "#fff", border: `4px solid ${PAL[(i + 1) % PAL.length]}`, padding: "12px 30px", borderRadius: 999, transform: `scale(${p})` }}>✓ {c}</div>; })}
      </div>
    </AbsoluteFill>
  );
};

export const CtaColor: React.FC<{ word: string; sub: string }> = ({ word, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(f, fps), b = pop(f, fps, 7);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 200 }}>
      <div style={{ fontFamily: "Display", fontWeight: 750, fontSize: 110, color: "#fff", opacity: a }}>Comment</div>
      <div style={{ marginTop: 24, fontFamily: "Display", fontWeight: 800, fontSize: 150, padding: "16px 50px", borderRadius: 40, color: "#111", background: `linear-gradient(${f * 5}deg, ${PAL[0]}, ${PAL[1]}, ${PAL[2]}, ${PAL[0]})`, transform: `scale(${interpolate(b, [0, 1], [1.8, 1]) * (1 + Math.sin(f / 6) * 0.03)})`, boxShadow: `0 0 80px ${PAL[1]}99` }}>{word}</div>
      <div style={{ marginTop: 44, fontFamily: "Body", fontWeight: 700, fontSize: 48, color: "#fff", opacity: b, textAlign: "center" }}>{sub}</div>
    </AbsoluteFill>
  );
};

type Word = { t: string; s: number; e: number };
export const PillCaptions: React.FC<{ words: Word[]; until: number }> = ({ words, until }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t > until) return null;
  const chunks: Word[][] = []; let cur: Word[] = [];
  words.forEach((w) => { cur.push(w); if (cur.length >= 3 || /[.,?]$/.test(w.t)) { chunks.push(cur); cur = []; } });
  if (cur.length) chunks.push(cur);
  let ci = -1; chunks.forEach((c, i) => { if (t >= c[0].s - 0.05) ci = i; });
  if (ci < 0) return null;
  const ch = chunks[ci];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1560, width: 980, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {ch.map((w, i) => {
          const active = t >= w.s - 0.03 && (i === ch.length - 1 || t < ch[i + 1].s - 0.03);
          const col = PAL[(ci + i) % PAL.length];
          return <span key={i} style={{ fontFamily: "Body", fontWeight: 900, fontSize: 70, textTransform: "uppercase", padding: "4px 18px", borderRadius: 18, color: active ? "#111" : "#fff", background: active ? col : "rgba(0,0,0,.45)", transform: `scale(${active ? 1.08 : 1})`, textShadow: active ? "none" : "0 4px 14px rgba(0,0,0,.8)" }}>{w.t.replace(/[.,]$/, "")}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

export type ColorBeat = { scene: (dur: number) => React.ReactNode };
export const ColorReel: React.FC<{ t: { starts: number[]; end: number }; words: Word[]; vo: string; beats: ColorBeat[]; handle: string }> = ({ t, words, vo, beats, handle }) => {
  const total = Math.round((t.end + 1.6) * FPS);
  return (
    <AbsoluteFill>
      <style>{fontCss}</style>
      <ColorBg />
      <Audio src={staticFile(vo)} />
      <Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, 8, total - 30, total], [0.35, 0.16, 0.16, 0], cl)} />
      {beats.map((b, i) => {
        const from = Math.round((i === 0 ? 0 : t.starts[i] - 0.08) * FPS);
        const to = i + 1 < beats.length ? Math.round((t.starts[i + 1] - 0.08) * FPS) : total;
        return (
          <React.Fragment key={i}>
            <Sequence from={from} durationInFrames={to - from}>{b.scene(to - from)}</Sequence>
            {i > 0 && <Sequence from={from - 4} durationInFrames={14}><FlashWipe seed={i} /></Sequence>}
          </React.Fragment>
        );
      })}
      <PillCaptions words={words} until={t.end} />
      <div style={{ position: "absolute", left: 60, top: 150, fontFamily: "Mono", fontSize: 28, color: "#fff", letterSpacing: 3, opacity: 0.85 }}>{handle}</div>
    </AbsoluteFill>
  );
};
