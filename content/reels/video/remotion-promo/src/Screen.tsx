// Reels built on a real screen recording of the site, with cards and captions on top.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop, C, Caption, Cta, FPS, TopCard, fontCss } from "./kit";

export type ScreenBeat = { line: string; src: [number, number]; card?: string; zoom?: number; cta?: { top: string; big: string; sub: string } };
export type ScreenDef = { id: string; vo: string; rec: string; t: { starts: number[]; end: number }; beats: ScreenBeat[]; hook: string };
const TAIL = 1.4;
export const screenFrames = (r: ScreenDef) => Math.round((r.t.end + TAIL) * FPS);

const Clip: React.FC<{ rec: string; src: [number, number]; dur: number; zoom: number }> = ({ rec, src, dur, zoom }) => {
  const f = useCurrentFrame();
  const rate = Math.min(4, Math.max(0.5, (src[1] - src[0]) / (dur / FPS)));
  const z = interpolate(f, [0, dur], [zoom, zoom * 1.05]);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 40%" }}>
      <OffthreadVideo src={staticFile(rec)} startFrom={Math.round(src[0] * FPS)} playbackRate={rate} muted style={{ width: 1080, height: 1920 }} />
    </AbsoluteFill>
  );
};

const HookCard: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const s = Math.min(1, f / 6);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(10,10,10,${0.55 * s})` }}>
      <div style={{ whiteSpace: "pre-line", textAlign: "center", fontFamily: "Display", fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: -2, color: "#111", background: C.accent, padding: "24px 44px", borderRadius: 34, transform: `scale(${interpolate(s, [0, 1], [1.4, 1])}) rotate(-1.5deg)` }}>{text}</div>
    </AbsoluteFill>
  );
};

export const ScreenReel: React.FC<{ r: ScreenDef }> = ({ r }) => {
  const total = screenFrames(r);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <style>{fontCss}</style>
      <Backdrop />
      <Audio src={staticFile(r.vo)} />
      <Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, total - 30, total], [0.1, 0.1, 0], { extrapolateRight: "clamp" })} />
      {r.beats.map((b, i) => {
        const from = Math.round((i === 0 ? 0 : r.t.starts[i] - 0.1) * FPS);
        const to = i + 1 < r.beats.length ? Math.round((r.t.starts[i + 1] - 0.1) * FPS) : total;
        const capFrom = Math.round(r.t.starts[i] * FPS);
        const capDur = Math.round(((r.t.starts[i + 1] ?? r.t.end) - r.t.starts[i]) * FPS);
        return (
          <React.Fragment key={i}>
            <Sequence from={from} durationInFrames={to - from}>
              {b.cta ? <><Backdrop /><Cta {...b.cta} /></> : <Clip rec={r.rec} src={b.src} dur={to - from} zoom={b.zoom ?? 1} />}
              {i === 0 && <Sequence durationInFrames={Math.round(2.6 * FPS)}><HookCard text={r.hook} /></Sequence>}
              {b.card && <Sequence from={i === 0 ? Math.round(2.6 * FPS) : 0}><TopCard text={b.card} /></Sequence>}
            </Sequence>
            {!b.cta && (
              <Sequence from={capFrom} durationInFrames={capDur}>
                <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 58%, rgba(10,10,10,.85) 70%, rgba(10,10,10,.85) 82%, transparent 92%)" }} />
                <Caption text={b.line} dur={capDur} />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 60, top: 160, fontFamily: "Mono", fontSize: 28, color: C.ink, letterSpacing: 3, textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>@STARXMARKETING</div>
    </AbsoluteFill>
  );
};
