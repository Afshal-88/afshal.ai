// Website-development reel: 3D laptop / phone / floating-browser mockups with real site
// screenshots scrolling inside, minimal kinetic words, cinematic HUD. Music-driven, no voiceover.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { FPS, fontCss } from "./kit";

const CREAM = "#efe8dc", INK = "#121212", Y = "#ffd400";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const s = (sec: number) => Math.round(sec * FPS);

// ---------- shared pieces ----------
const Hud: React.FC<{ label: string; dark?: boolean }> = ({ label, dark = true }) => {
  const f = useCurrentFrame();
  const c = dark ? "rgba(255,255,255,.75)" : "rgba(0,0,0,.6)";
  const tc = `00:00:${String(Math.floor(f / FPS)).padStart(2, "0")}:${String(f % FPS).padStart(2, "0")}`;
  const corner = (st: React.CSSProperties) => <div style={{ position: "absolute", width: 46, height: 46, borderColor: c, borderStyle: "solid", ...st }} />;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {corner({ left: 50, top: 230, borderWidth: "3px 0 0 3px" })}{corner({ right: 50, top: 230, borderWidth: "3px 3px 0 0" })}
      {corner({ left: 50, bottom: 300, borderWidth: "0 0 3px 3px" })}{corner({ right: 50, bottom: 300, borderWidth: "0 3px 3px 0" })}
      <div style={{ position: "absolute", left: 60, top: 175, fontFamily: "Mono", fontSize: 26, color: c, letterSpacing: 3, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ width: 14, height: 14, borderRadius: 99, background: "#ff3b3b", opacity: f % 30 < 18 ? 1 : 0.2 }} />REC {tc}
      </div>
      <div style={{ position: "absolute", right: 60, top: 175, fontFamily: "Mono", fontSize: 26, color: c, letterSpacing: 3 }}>{label}</div>
    </AbsoluteFill>
  );
};

const SitePill: React.FC<{ domain: string; tags: string[]; dark?: boolean }> = ({ domain, tags, dark = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - 10, fps, config: { damping: 16 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 300, paddingTop: 30, paddingBottom: 20, background: dark ? "linear-gradient(transparent, rgba(0,0,0,.55) 30%, rgba(0,0,0,.55))" : "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` }}>
      <div style={{ fontFamily: "Display", fontWeight: 700, fontSize: 54, color: dark ? "#fff" : INK }}>{domain}</div>
      <div style={{ display: "flex", gap: 12 }}>
        {tags.map((t) => <span key={t} style={{ fontFamily: "Mono", fontSize: 26, letterSpacing: 2, color: dark ? "#fff" : INK, border: `2px solid ${dark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.3)"}`, padding: "8px 16px", borderRadius: 999 }}>{t}</span>)}
      </div>
    </div>
  );
};

// Screen content: a tall full-page screenshot that scrolls with easing.
const Scroller: React.FC<{ src: string; w: number; h: number; imgH: number; dur: number; from?: number; to?: number }> = ({ src, w, h, imgH, dur, from = 0, to = 0.7 }) => {
  const f = useCurrentFrame();
  const scaled = imgH * (w / 1200);
  const max = Math.max(0, scaled - h);
  const y = interpolate(f, [s(0.5), dur - s(0.3)], [from * max, to * max], { ...cl, easing: ease });
  return <div style={{ width: w, height: h, overflow: "hidden", background: "#fff" }}><Img src={staticFile(src)} style={{ width: w, transform: `translateY(${-y}px)` }} /></div>;
};

// ---------- 3D laptop ----------
const Laptop: React.FC<{ src: string; imgH: number; dur: number; mood: "neon" | "wood"; ry: [number, number]; zoom: [number, number] }> = ({ src, imgH, dur, mood, ry, zoom }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { ...cl, easing: ease });
  const rotY = interpolate(t, [0, 1], ry), sc = interpolate(t, [0, 1], zoom);
  const W = 860, H = 540;
  const bg = mood === "neon"
    ? "radial-gradient(ellipse at 50% 30%, #1b2a33 0%, #0a0d10 60%), #0a0d10"
    : "radial-gradient(ellipse at 50% 25%, #3a2a1f 0%, #15100c 70%)";
  const desk = mood === "neon" ? "linear-gradient(#11161a, #050607)" : "linear-gradient(#5a3b26, #2a1a10)";
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {mood === "neon" && <div style={{ position: "absolute", top: 120, left: -100, right: -100, height: 10, background: "#22e1ff", filter: "blur(14px)", opacity: 0.9 }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, bottom: 0, background: desk }} />
      {mood === "neon" && <div style={{ position: "absolute", left: -50, right: -50, top: 1056, height: 6, background: "#22e1ff", filter: "blur(6px)", opacity: 0.8 }} />}
      <AbsoluteFill style={{ perspective: 2200, alignItems: "center", justifyContent: "center", paddingBottom: 380 }}>
        <div style={{ transformStyle: "preserve-3d", transform: `scale(${sc * 0.95}) rotateX(14deg) rotateY(${rotY}deg)` }}>
          {/* screen */}
          <div style={{ width: W + 36, padding: 18, paddingBottom: 26, borderRadius: 28, background: "#0d0d0f", boxShadow: "0 0 0 3px #2b2b30, 0 50px 120px rgba(0,0,0,.6)", transformOrigin: "bottom", transform: "rotateX(-4deg)" }}>
            <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
              <Scroller src={src} w={W} h={H} imgH={imgH} dur={dur} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.14) 0%, transparent 35%)" }} />
            </div>
          </div>
          {/* base */}
          <div style={{ width: W + 140, height: 300, marginLeft: -52, marginTop: -2, transformOrigin: "top", transform: "rotateX(-74deg)", borderRadius: "0 0 34px 34px", background: "linear-gradient(#b8bcc4, #8b9098)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", position: "relative" }}>
            <div style={{ position: "absolute", left: 70, right: 70, top: 26, height: 170, borderRadius: 10, background: "repeating-linear-gradient(90deg, #1d1e22 0 46px, #8b9098 46px 52px), #1d1e22", opacity: 0.9 }} />
            <div style={{ position: "absolute", left: "36%", right: "36%", top: 210, height: 70, borderRadius: 10, background: "#a3a8b0", boxShadow: "inset 0 0 0 2px #7d828a" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- floating browser stack ----------
const Browser: React.FC<{ src: string; imgH: number; dur: number; w: number; from: number; to: number }> = ({ src, imgH, dur, w, from, to }) => (
  <div style={{ width: w, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,.55)" }}>
    <div style={{ height: 38, background: "#ececec", display: "flex", gap: 9, alignItems: "center", paddingLeft: 16 }}>{["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />)}</div>
    <Scroller src={src} w={w} h={Math.round(w * 0.62)} imgH={imgH} dur={dur} from={from} to={to} />
  </div>
);

const Stack: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { ...cl, easing: ease });
  const panels = [
    { src: "buzzazi-desktop.png", h: 2160, x: -230, y: -330, z: -200, r: 22, from: 0, to: 0.5 },
    { src: "zufishan-desktop.png", h: 2160, x: 170, y: 40, z: 60, r: 22, from: 0.1, to: 0.6 },
    { src: "keune-desktop.png", h: 1954, x: -120, y: 420, z: -80, r: 22, from: 0.2, to: 0.7 },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #2a2a2a, ${INK} 70%)`, perspective: 2000, alignItems: "center", justifyContent: "center", paddingBottom: 520, overflow: "hidden" }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${interpolate(t, [0, 1], [18, 10])}deg) rotateY(${interpolate(t, [0, 1], [-28, -16])}deg) rotateZ(4deg) scale(${interpolate(t, [0, 1], [0.92, 1.05])})` }}>
        {panels.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x - 330, top: p.y - 230, transform: `translateZ(${p.z + Math.sin(f / 30 + i) * 20}px)` }}>
            <Browser src={p.src} imgH={p.h} dur={dur} w={660} from={p.from} to={p.to} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- phone + laptop ----------
const PhoneScene: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { ...cl, easing: ease });
  return (
    <AbsoluteFill style={{ background: CREAM, perspective: 2000, alignItems: "center", justifyContent: "center", paddingBottom: 260 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateY(${interpolate(t, [0, 1], [-24, -8])}deg) rotateX(6deg) scale(${interpolate(t, [0, 1], [0.95, 1.06])})` }}>
        <div style={{ width: 400, padding: 14, borderRadius: 58, background: "#111", boxShadow: "0 50px 100px rgba(0,0,0,.35)" }}>
          <div style={{ borderRadius: 46, overflow: "hidden" }}>
            <div style={{ width: 372, height: 790, overflow: "hidden", background: "#fff" }}>
              <Img src={staticFile("keune-mobile.png")} style={{ width: 372, transform: `translateY(${-interpolate(f, [s(0.4), dur], [0, 0.55 * (2190 * 372 / 327 - 790)], { ...cl, easing: ease })}px)` }} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- kinetic words ----------
const Word: React.FC<{ light?: string; bold: string; dark?: boolean; size?: number }> = ({ light, bold, dark = false, size = 120 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 18, stiffness: 160 } });
  const b = spring({ frame: f - 5, fps, config: { damping: 18, stiffness: 160 } });
  const fg = dark ? "#fff" : INK;
  return (
    <AbsoluteFill style={{ background: dark ? INK : CREAM, alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
      {light && <div style={{ fontFamily: "Body", fontWeight: 400, fontSize: size * 0.42, color: fg, opacity: 0.75 * a, transform: `translateY(${interpolate(a, [0, 1], [20, 0])}px)` }}>{light}</div>}
      <div style={{ fontFamily: "Display", fontWeight: 760, fontSize: size, letterSpacing: -2, color: fg, opacity: b, transform: `translateY(${interpolate(b, [0, 1], [40, 0])}px)`, filter: `blur(${interpolate(b, [0, 1], [8, 0])}px)` }}>{bold}</div>
      <div style={{ position: "absolute", bottom: 210, fontFamily: "Mono", fontSize: 26, letterSpacing: 3, color: fg, opacity: 0.55 }}># starxmarketing</div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 14 } }), b = spring({ frame: f - 10, fps, config: { damping: 16 } }), c = spring({ frame: f - 20, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: CREAM, alignItems: "center", justifyContent: "center", paddingBottom: 140 }}>
      <Img src={staticFile("logo-starx.webp")} style={{ width: 420, mixBlendMode: "multiply", transform: `scale(${interpolate(a, [0, 1], [0.6, 1])})`, opacity: a }} />
      <div style={{ marginTop: 40, fontFamily: "Body", fontSize: 44, color: INK, opacity: b, textAlign: "center" }}>Websites built to bring in <b>enquiries.</b></div>
      <div style={{ marginTop: 50, fontFamily: "Display", fontWeight: 760, fontSize: 64, color: INK, background: Y, padding: "16px 40px", borderRadius: 999, opacity: c, transform: `scale(${interpolate(c, [0, 1], [0.8, 1])})` }}>DM “WEBSITE”</div>
      <div style={{ marginTop: 30, fontFamily: "Mono", fontSize: 30, letterSpacing: 3, color: INK, opacity: c * 0.7 }}>starxmarketing.com</div>
    </AbsoluteFill>
  );
};

const HookCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 18 } }), b = spring({ frame: f - 14, fps, config: { damping: 18 } });
  const n = Math.min(50, Math.floor(interpolate(f, [0, 22], [0, 50], cl)));
  return (
    <AbsoluteFill style={{ background: INK, alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
      <div style={{ fontFamily: "Mono", fontSize: 30, letterSpacing: 4, color: "rgba(255,255,255,.6)", opacity: a }}>WEBSITES BUILT</div>
      <div style={{ fontFamily: "Display", fontWeight: 800, fontSize: 300, lineHeight: 1, color: "#fff", opacity: a }}>{n}+</div>
      <div style={{ marginTop: 10, fontFamily: "Body", fontSize: 56, color: "#fff", opacity: b, transform: `translateY(${interpolate(b, [0, 1], [24, 0])}px)` }}>Here are <b style={{ color: Y }}>four.</b></div>
    </AbsoluteFill>
  );
};

// ---------- timeline ----------
type Cut = { d: number; el: (dur: number) => React.ReactNode; hud?: string; hudDark?: boolean };
export const WEB_CUTS: Cut[] = [
  { d: 2.4, el: () => <HookCard />, hud: "STAR X · WEB", hudDark: true },
  { d: 3.8, el: (d) => <><Laptop src="keune-desktop.png" imgH={1954} dur={d} mood="neon" ry={[-24, -10]} zoom={[0.9, 1.06]} /><SitePill domain="keunepakistan.com" tags={["Shopify", "Custom theme"]} /></>, hud: "01 / 04" },
  { d: 1.0, el: () => <Word light="built for" bold="E-commerce." /> },
  { d: 3.6, el: (d) => <><Laptop src="houseofflowers-desktop.png" imgH={2195} dur={d} mood="wood" ry={[20, 8]} zoom={[0.92, 1.08]} /><SitePill domain="houseofflowers.pk" tags={["Shopify", "Same-day delivery"]} /></>, hud: "02 / 04" },
  { d: 1.0, el: () => <Word light="made for" bold="Fashion." dark /> },
  { d: 3.6, el: (d) => <><Stack dur={d} /><SitePill domain="buzzazi.com · zufishan" tags={["Shopify", "Custom orders"]} /></>, hud: "03–04 / 04" },
  { d: 2.6, el: (d) => <><PhoneScene dur={d} /><SitePill domain="Looks right on mobile too" tags={["keunepakistan.com"]} dark={false} /></>, hud: "MOBILE", hudDark: false },
  { d: 0.6, el: () => <Word bold="Design." /> },
  { d: 0.6, el: () => <Word bold="Development." dark size={104} /> },
  { d: 0.6, el: () => <Word bold="Speed." /> },
  { d: 0.6, el: () => <Word bold="SEO." dark /> },
  { d: 3.4, el: () => <EndCard /> },
];
export const webFrames = s(WEB_CUTS.reduce((a, c) => a + c.d, 0));

export const WebReel: React.FC = () => {
  let t = 0;
  const cuts = WEB_CUTS.map((c) => { const from = s(t); t += c.d; return { ...c, from, dur: s(c.d) }; });
  return (
    <AbsoluteFill style={{ background: INK }}>
      <style>{fontCss}</style>
      <Audio src={staticFile("music.mp3")} volume={(fr) => interpolate(fr, [0, 6, webFrames - 30, webFrames], [0, 0.9, 0.9, 0], cl)} />
      {cuts.map((c, i) => (
        <Sequence key={i} from={c.from} durationInFrames={c.dur}>
          {c.el(c.dur)}
          {c.hud && <Hud label={c.hud} dark={c.hudDark ?? true} />}
          {i > 0 && <Audio src={staticFile("whoosh.wav")} volume={0.5} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
