import React from "react";
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import timings from "./timings.json";

const FPS = 30;
const C = { bg: "#0f0f0f", bg2: "#171717", line: "#2a2a2a", ink: "#f5f5f2", mute: "#9a9a96", accent: "#ffd400" };

const fontCss = `
@font-face{font-family:Display;src:url(${staticFile("display.woff2")}) format("woff2");font-weight:200 800}
@font-face{font-family:Body;src:url(${staticFile("body.woff2")}) format("woff2");font-weight:200 900}
@font-face{font-family:Mono;src:url(${staticFile("mono.woff2")}) format("woff2");font-weight:100 900}`;

// Spoken lines and where each starts (seconds). timings.json is rewritten from the real voiceover.
const LINES = [
  "Stop planning posts every night. One prompt.",
  "Posting daily is hard. Deciding what to post is harder.",
  "I paste this prompt into an AI chat.",
  "I fill in three things. Business, customer, offer.",
  "Let's try a home bakery in Lahore.",
  "It gives me seven days. Reels, carousels, stories.",
  "Each day gets a hook, a script and a caption.",
  "I fix what doesn't sound like them.",
  "That's the whole week. Done.",
  "Comment PLAN for the prompt. Then stop planning every night.",
];
const starts: number[] = timings.starts;
const end: number = timings.end;
export const totalFrames = Math.round((end + 0.6) * FPS);
const beatFrames = (i: number) => [Math.round(starts[i] * FPS), Math.round((starts[i + 1] ?? end + 0.6) * FPS)];

// On-screen cards: separate from the voice, six words max.
const CARDS: Record<number, string> = {
  1: "What do I post today?",
  3: "Business · Customer · Offer",
  5: "7 days. Done.",
  6: "Hook + script + caption",
  7: "Make it sound like them",
};

const DAYS = [
  { d: "MON", f: "Reel", t: "5am, the first batch" },
  { d: "TUE", f: "Carousel", t: "3 cakes for 3 kinds of birthday" },
  { d: "WED", f: "Stories", t: "Poll: chocolate or vanilla?" },
  { d: "THU", f: "Reel", t: "\"Can you make it eggless?\"" },
  { d: "FRI", f: "Carousel", t: "How to order in 3 steps" },
  { d: "SAT", f: "Reel", t: "The weekend brownie box" },
  { d: "SUN", f: "Stories", t: "Packing Sunday orders" },
];

const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180, mass: 0.6 } });

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.bg2, border: `2px solid ${C.line}`, borderRadius: 36, padding: 44, ...style }}>{children}</div>
);

const Cursor: React.FC = () => {
  const f = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 6, height: "1em", background: C.accent, marginLeft: 4, verticalAlign: "-0.12em", opacity: Math.floor(f / 12) % 2 ? 0 : 1 }} />;
};

const typed = (text: string, frame: number, startF: number, cps = 22) =>
  text.slice(0, Math.max(0, Math.floor(((frame - startF) / FPS) * cps)));

// ---------- scenes (frame is local to the beat) ----------
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(f, fps, 0), b = pop(f, fps, 10);
  const strike = interpolate(f, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 200 }}>
      <div style={{ fontFamily: "Display", fontWeight: 750, color: C.ink, fontSize: 150, lineHeight: 0.95, textAlign: "center", letterSpacing: -4 }}>
        <div style={{ transform: `scale(${interpolate(a, [0, 1], [1.4, 1])})`, opacity: a }}>7 DAYS<br />OF POSTS.</div>
        <div style={{ marginTop: 30, transform: `scale(${interpolate(b, [0, 1], [1.6, 1])})`, opacity: b }}>
          <span style={{ background: C.accent, color: "#111", padding: "6px 30px", borderRadius: 24 }}>1 PROMPT.</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 330, fontFamily: "Mono", fontSize: 40, color: C.mute, letterSpacing: 4 }}>
        <span style={{ position: "relative" }}>
          PLANNING EVERY NIGHT
          <span style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${strike * 100}%`, background: C.accent }} />
        </span>
      </div>
    </AbsoluteFill>
  );
};

const WeekGrid: React.FC<{ filled?: number; checks?: boolean }> = ({ filled = 0, checks }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22, width: 900 }}>
      {DAYS.map((x, i) => {
        const on = i < filled;
        const s = checks ? pop(f, fps, i * 3) : 1;
        return (
          <div key={x.d} style={{ gridColumn: i === 6 ? "span 2" : undefined, background: on ? "#1f1d12" : C.bg2, border: `2px solid ${on ? C.accent : C.line}`, borderRadius: 26, padding: "26px 30px", minHeight: 120, transform: `scale(${s})` }}>
            <div style={{ fontFamily: "Mono", fontSize: 30, color: on ? C.accent : C.mute, letterSpacing: 3, display: "flex", justifyContent: "space-between" }}>
              <span>{x.d}</span>{checks && <span>✓</span>}
            </div>
            <div style={{ fontFamily: "Body", fontSize: 34, color: C.ink, marginTop: 10, fontWeight: 600 }}>
              {on ? x.f : i === 0 && !filled ? <Cursor /> : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Why: React.FC = () => <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><WeekGrid /></AbsoluteFill>;

const PROMPT_LINES = [
  "You are a social media strategist",
  "for a small business.",
  "",
  "Business: [ ________ ]",
  "Customer: [ ________ ]",
  "Offer this week: [ ________ ]",
  "",
  "Plan 7 days of Instagram content.",
  "3 Reels, 2 carousels, 2 story sets.",
  "Each day: hook, script, caption.",
];

const FIELDS = [
  { k: "Business", v: "Home bakery, Lahore" },
  { k: "Customer", v: "Parents, birthdays" },
  { k: "Offer this week", v: "Weekend brownie box" },
];

const PromptBox: React.FC<{ mode: "paste" | "highlight" | "type" }> = ({ mode }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = mode === "paste" ? pop(f, fps, 6) : 1;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Panel style={{ width: 920, transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px)`, opacity: p }}>
        <div style={{ fontFamily: "Mono", fontSize: 26, color: C.mute, letterSpacing: 3, marginBottom: 24 }}>NEW CHAT · PROMPT</div>
        {PROMPT_LINES.map((l, i) => {
          const field = FIELDS.find((x) => l.startsWith(x.k + ":"));
          if (!field) return <div key={i} style={{ fontFamily: "Body", fontSize: 38, color: C.ink, minHeight: 22, lineHeight: 1.3 }}>{l}</div>;
          const fi = FIELDS.indexOf(field);
          const hl = mode === "highlight" ? interpolate(f, [fi * 14, fi * 14 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : mode === "type" ? 1 : 0;
          const val = mode === "type" ? typed(field.v, f, fi * 18, 30) : "";
          return (
            <div key={i} style={{ fontFamily: "Body", fontSize: 38, color: C.ink, lineHeight: 1.3, margin: "6px 0" }}>
              {field.k}:{" "}
              <span style={{ background: hl ? `rgba(255,212,0,${0.18 * hl})` : "transparent", border: `3px solid ${hl ? C.accent : C.line}`, borderRadius: 14, padding: "2px 16px", color: mode === "type" ? C.accent : C.mute, fontWeight: 700 }}>
                {mode === "type" ? <>{val}{val.length < field.v.length && val.length > 0 ? <Cursor /> : null}{!val ? "…" : null}</> : "________"}
              </span>
            </div>
          );
        })}
      </Panel>
    </AbsoluteFill>
  );
};

const Output: React.FC = () => {
  const f = useCurrentFrame();
  const shown = Math.min(7, Math.floor(f / 8) + 1);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Panel style={{ width: 920, padding: 36 }}>
        <div style={{ fontFamily: "Mono", fontSize: 26, color: C.mute, letterSpacing: 3, marginBottom: 18 }}>AI · 7-DAY PLAN</div>
        {DAYS.slice(0, shown).map((x) => (
          <div key={x.d} style={{ display: "flex", gap: 22, alignItems: "baseline", padding: "12px 0", borderTop: `1px solid ${C.line}` }}>
            <span style={{ fontFamily: "Mono", fontSize: 28, color: C.accent, width: 76 }}>{x.d}</span>
            <span style={{ fontFamily: "Body", fontSize: 30, color: C.mute, width: 150 }}>{x.f}</span>
            <span style={{ fontFamily: "Body", fontSize: 32, color: C.ink, fontWeight: 600, flex: 1 }}>{x.t}</span>
          </div>
        ))}
      </Panel>
    </AbsoluteFill>
  );
};

const DayCard: React.FC<{ fix?: boolean }> = ({ fix }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { k: "HOOK", v: "This is what 5am smells like." },
    { k: "SCRIPT", v: "Oven on. Butter, sugar, the first tray. By 7, the Saturday orders are boxed." },
  ];
  const oldCap = "Indulge in our delectable handcrafted treats!";
  const newCap = "Fresh out of the oven. Order by 6pm.";
  const strike = fix ? interpolate(f, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const z = fix ? 1 : interpolate(pop(f, fps, 0), [0, 1], [0.85, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Panel style={{ width: 920, transform: `scale(${z})`, borderColor: C.accent }}>
        <div style={{ fontFamily: "Mono", fontSize: 28, color: C.accent, letterSpacing: 3 }}>MON · REEL</div>
        {rows.map((r, i) => (
          <div key={r.k} style={{ marginTop: 26, opacity: fix ? 0.45 : interpolate(f, [6 + i * 10, 14 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ fontFamily: "Mono", fontSize: 24, color: C.mute, letterSpacing: 3 }}>{r.k}</div>
            <div style={{ fontFamily: "Body", fontSize: 40, color: C.ink, fontWeight: 600, lineHeight: 1.25, marginTop: 6 }}>{r.v}</div>
          </div>
        ))}
        <div style={{ marginTop: 26, opacity: fix ? 1 : interpolate(f, [26, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontFamily: "Mono", fontSize: 24, color: C.mute, letterSpacing: 3 }}>CAPTION</div>
          <div style={{ fontFamily: "Body", fontSize: 40, fontWeight: 600, lineHeight: 1.25, marginTop: 6, position: "relative", color: fix ? C.mute : C.ink }}>
            <span style={{ position: "relative" }}>{oldCap}
              {fix && <span style={{ position: "absolute", left: 0, top: "50%", height: 5, width: `${strike * 100}%`, background: "#ff5a4f" }} />}
            </span>
          </div>
          {fix && (
            <div style={{ fontFamily: "Body", fontSize: 44, fontWeight: 700, color: C.accent, marginTop: 14 }}>
              {typed(newCap, f, 22, 30)}{typed(newCap, f, 22, 30).length < newCap.length && <Cursor />}
            </div>
          )}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

const Whole: React.FC = () => <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><WeekGrid filled={7} checks /></AbsoluteFill>;

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = pop(f, fps, 0), b = pop(f, fps, 8);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 160 }}>
      <div style={{ fontFamily: "Display", fontWeight: 750, color: C.ink, fontSize: 110, textAlign: "center", lineHeight: 1, opacity: a, transform: `scale(${interpolate(a, [0, 1], [1.3, 1])})` }}>Comment</div>
      <div style={{ marginTop: 30, fontFamily: "Display", fontWeight: 800, fontSize: 210, background: C.accent, color: "#111", padding: "0 50px", borderRadius: 40, letterSpacing: -4, transform: `scale(${interpolate(b, [0, 1], [1.6, 1])})`, opacity: b }}>PLAN</div>
      <div style={{ marginTop: 40, fontFamily: "Body", fontSize: 44, color: C.mute, opacity: b }}>and I'll send you the prompt</div>
    </AbsoluteFill>
  );
};

const SCENES: React.FC[] = [
  Hook, Why,
  () => <PromptBox mode="paste" />, () => <PromptBox mode="highlight" />, () => <PromptBox mode="type" />,
  Output, () => <DayCard />, () => <DayCard fix />, Whole, Cta,
];

// ---------- overlays ----------
const TopCard: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps, 0);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 250, maxWidth: 900, whiteSpace: "nowrap", textAlign: "center", fontFamily: "Display", fontWeight: 750, fontSize: 62, color: "#111", background: C.accent, padding: "14px 34px", borderRadius: 24, lineHeight: 1.05, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])}) rotate(-1.5deg)`, opacity: s }}>{text}</div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const per = (dur * 0.92) / words.length;
  // Show the current chunk of up to 4 words, highlight the word being said.
  const idx = Math.min(words.length - 1, Math.floor(f / per));
  const chunkStart = Math.floor(idx / 4) * 4;
  const chunk = words.slice(chunkStart, chunkStart + 4);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 1290, width: 900, textAlign: "center", fontFamily: "Body", fontWeight: 800, fontSize: 64, lineHeight: 1.15, color: C.ink, textShadow: "0 4px 18px rgba(0,0,0,.8)" }}>
        {chunk.map((w, i) => (
          <span key={i} style={{ color: chunkStart + i === idx ? C.accent : C.ink }}>{w}{" "}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`, backgroundSize: "54px 54px", backgroundPosition: `0 ${-(f * 0.8) % 54}px`, opacity: 0.55 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 30%, #0f0f0f 85%)" }} />
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <style>{fontCss}</style>
    <Backdrop />
    {timings.audio && <Audio src={staticFile(timings.audio)} />}
    {SCENES.map((S, i) => {
      const [a, b] = beatFrames(i);
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}>
          <div style={{ position: "absolute", left: 0, right: 0, top: i === 0 || i === 9 ? 0 : 420, height: i === 0 || i === 9 ? 1920 : 820 }}><BeatZoom><S /></BeatZoom></div>
          {CARDS[i] && <TopCard text={CARDS[i]} />}
          <Caption text={LINES[i]} dur={b - a} />
        </Sequence>
      );
    })}
    <div style={{ position: "absolute", left: 60, top: 160, fontFamily: "Mono", fontSize: 28, color: C.mute, letterSpacing: 3 }}>@AFSHAL.AI</div>
  </AbsoluteFill>
);

const BeatZoom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 120], [1, 1.04], { extrapolateRight: "clamp" });
  const o = interpolate(f, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${s})`, opacity: o }}>{children}</AbsoluteFill>;
};
