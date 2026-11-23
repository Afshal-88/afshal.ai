// "One studio" word-cut reel (beat-matched to the reference audio), Star X colours,
// ending with an animated Star X logo.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { FPS, fontCss } from "./kit";

const BLACK = "#0f0f0f", YEL = "#ffd400";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const CUTS = [0, 0.5, 0.967, 1.467, 1.933, 2.4, 2.9, 3.367, 3.867, 4.333, 4.8, 5.3, 5.767, 6.267, 6.733, 7.2, 7.7, 8.167, 8.667, 9.133, 9.6, 10.1];
const LOGO_AT = 10.567, END = 13.677;
const WORDS = ["Graphic Design", "Web Design", "Development", "E-commerce", "Mobile Apps", "Social Media", "Reels", "Video Editing",
  "Branding", "Automation", "AI Chatbots", "Paid Ads", "Strategy", "Identity", "Motion", "Precision", "Performance", "Scale",
  "Results", "We're here", "We're ready", "To transform"];
export const oneStudioFrames = Math.round(END * FPS);

const Footer: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontFamily: "Body", fontSize: 26, color: dark ? "#fff" : BLACK }}>
    <span style={{ fontWeight: 400 }}>#</span><span><b>starx</b><span style={{ opacity: 0.7 }}>marketing</span></span>
  </div>
);

const WordCard: React.FC<{ text: string; dark: boolean }> = ({ text, dark }) => {
  const f = useCurrentFrame();
  const sc = interpolate(f, [0, 4], [0.97, 1], cl);
  return (
    <AbsoluteFill style={{ background: dark ? BLACK : YEL }}>
      <AbsoluteFill style={{ background: dark ? "radial-gradient(circle at 85% 82%, rgba(255,255,255,.07), transparent 40%)" : "radial-gradient(circle at 85% 82%, rgba(0,0,0,.08), transparent 45%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 160 }}>
        <div style={{ fontFamily: "Body", fontWeight: 800, fontSize: 70, letterSpacing: -0.5, color: dark ? "#fff" : BLACK, transform: `scale(${sc})` }}>{text}</div>
      </AbsoluteFill>
      <Footer dark={dark} />
    </AbsoluteFill>
  );
};

const LogoAnim: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const W = 760; // logo width on screen (source 425x240)
  const H = Math.round((W * 240) / 425);
  const xIn = spring({ frame: f, fps, config: { damping: 11, stiffness: 170 } });
  const starWipe = interpolate(t, [0.25, 0.75], [0, 100], { ...cl, easing: Easing.out(Easing.cubic) });
  const mkWipe = interpolate(t, [0.7, 1.1], [0, 100], { ...cl, easing: Easing.out(Easing.cubic) });
  const line = interpolate(t, [1.2, 1.7], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const handle = interpolate(t, [1.6, 2.0], [0, 1], cl);
  const glow = interpolate(t, [0, 0.35, 1.2], [0, 1, 0.25], cl);
  const layer = (clip: string, extra: React.CSSProperties = {}) => (
    <Img src={staticFile("starx-logo.png")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, clipPath: clip, ...extra }} />
  );
  return (
    <AbsoluteFill style={{ background: BLACK, alignItems: "center", justifyContent: "center", paddingBottom: 200 }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 85% 82%, rgba(255,255,255,.06), transparent 40%)" }} />
      <div style={{ position: "relative", width: W, height: H }}>
        {/* X: slams in */}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "84% 50%", transform: `scale(${interpolate(xIn, [0, 1], [1.7, 1])})`, opacity: Math.min(1, xIn * 1.4), filter: `drop-shadow(0 0 ${40 * glow}px rgba(255,212,0,.8))` }}>
          {layer("polygon(66% 0, 100% 0, 100% 100%, 64% 100%)")}
        </div>
        {/* STAR: wipes left to right */}
        {layer(`polygon(0 0, ${Math.min(starWipe, 100) * 0.7}% 0, ${Math.min(starWipe, 100) * 0.7}% 68%, 0 68%)`)}
        {/* Marketing + small line */}
        {layer(`polygon(0 68%, ${mkWipe * 0.66}% 68%, ${mkWipe * 0.66}% 100%, 0 100%)`)}
      </div>
      <div style={{ marginTop: 34, width: 420 * line, height: 3, background: YEL, borderRadius: 2 }} />
      <div style={{ marginTop: 22, fontFamily: "Body", fontSize: 32, letterSpacing: 1, color: "#fff", opacity: handle }}>@starxmarketing</div>
    </AbsoluteFill>
  );
};

export const OneStudioReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ background: BLACK }}>
    <style>{fontCss}</style>
    {withAudio && <Audio src={staticFile("onestudio-audio.wav")} />}
    {WORDS.map((w, i) => {
      const from = Math.round(CUTS[i] * FPS);
      const to = Math.round((CUTS[i + 1] ?? LOGO_AT) * FPS);
      return <Sequence key={i} from={from} durationInFrames={to - from}><WordCard text={w} dark={i % 2 === 0} /></Sequence>;
    })}
    <Sequence from={Math.round(LOGO_AT * FPS)}><LogoAnim /></Sequence>
  </AbsoluteFill>
);
