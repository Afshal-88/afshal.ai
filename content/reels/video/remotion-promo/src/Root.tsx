import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, interpolate, staticFile } from "remotion";
import timings from "./timings.json";
import { Backdrop, C, Caption, Chips, Cta, FPS, Headline, Phone, Report, Sheet, Statement, TopCard, fontCss } from "./kit";

type Beat = { line: string; scene: React.ReactNode; card?: string };
type ReelDef = { id: string; vo: string; t: { starts: number[]; end: number }; beats: Beat[] };

const REEL03: ReelDef = {
  id: "Reel03", vo: "vo03.wav", t: timings.r03,
  beats: [
    { line: "Stop replying to WhatsApp at 2am.", scene: <Headline lines={["STOP REPLYING", "[AT 2AM]"]} /> },
    { line: "Every late reply is a customer who might not wait.", card: "Seen. No reply.", scene: <Phone title="New customer" time="2:14 AM" msgs={[{ from: "them", text: "Hi, is this still available?", at: 4, meta: "2:14 AM" }, { from: "them", text: "Hello?", at: 30, meta: "2:31 AM" }]} /> },
    { line: "So we're building something at Star X Marketing.", scene: <Statement text={"SOMETHING'S\nCOMING"} sub="STAR X MARKETING" /> },
    { line: "WhatsApp that answers common questions in seconds.", card: "Replied in seconds", scene: <Phone title="New customer" time="2:14 AM" msgs={[{ from: "them", text: "What are your prices?", at: 2, meta: "2:14 AM" }, { from: "us", text: "Hi! Here's our full price list. Want me to book you in?", at: 22, meta: "2:14 AM · auto" }]} /> },
    { line: "Day or night.", scene: <Headline lines={["DAY", "[OR NIGHT]"]} size={170} /> },
    { line: "And follows up when people go quiet.", card: "Auto follow-up", scene: <Phone title="Customer" time="2 days later" msgs={[{ from: "them", text: "Let me think about it.", at: 0, meta: "Mon" }, { from: "us", text: "Hi! Still interested? Here's the link to order whenever you're ready.", at: 18, meta: "Wed · auto" }]} /> },
    { line: "So nobody slips through.", scene: <Statement text={"NOBODY\nSLIPS THROUGH"} /> },
    { line: "It runs on your own WhatsApp Business account.", scene: <Chips title="BUILT ON" items={["Your WhatsApp Business", "Your accounts", "You own it"]} /> },
    { line: "Coming soon.", scene: <Statement text={"COMING\nSOON"} sub="STAR X MARKETING" /> },
    { line: "Comment AI, and stop replying at 2am.", scene: <Cta top="Comment" big="AI" sub="and stop replying at 2am" /> },
  ],
};

const REEL04: ReelDef = {
  id: "Reel04", vo: "vo04.wav", t: timings.r04,
  beats: [
    { line: "Stop losing leads in 5 different apps.", scene: <Headline lines={["5 APPS.", "[0 SYSTEM.]"]} size={160} /> },
    { line: "Ads. Instagram DMs. Your website. WhatsApp. A notebook.", scene: <Chips scattered step={18} items={["Facebook ads", "Instagram DMs", "Website form", "WhatsApp", "A notebook"]} /> },
    { line: "So nobody knows who to call back.", scene: <Headline lines={["WHO DO WE", "[CALL BACK?]"]} size={130} /> },
    { line: "We're fixing that at Star X Marketing.", scene: <Statement text={"WE'RE\nFIXING THAT"} sub="STAR X MARKETING" /> },
    { line: "Every lead lands in 1 sheet.", card: "1 place for every lead", scene: <Sheet rows={[["Lead #101", "Facebook ad"], ["Lead #102", "Instagram DM"], ["Lead #103", "Website"], ["Lead #104", "WhatsApp"]]} /> },
    { line: "With where it came from.", scene: <Sheet highlightCol rows={[["Lead #101", "Facebook ad"], ["Lead #102", "Instagram DM"], ["Lead #103", "Website"], ["Lead #104", "WhatsApp"]]} /> },
    { line: "And every Monday, 1 short report. Leads, sales, ad spend.", card: "Every Monday", scene: <Report /> },
    { line: "All set up on your accounts, so you own it.", scene: <Chips title="YOURS FROM DAY ONE" items={["Your accounts", "Your data", "You own it"]} /> },
    { line: "Want to know what we'd fix first?", scene: <Headline lines={["WHAT WOULD", "WE FIX", "[FIRST?]"]} size={130} /> },
    { line: "Get a free AI audit, and stop losing leads. Link in bio.", scene: <Cta top="Get a" big="FREE AI AUDIT" sub="Link in bio" /> },
  ],
};

const TAIL = 1.4;
const frames = (r: ReelDef) => Math.round((r.t.end + TAIL) * FPS);

const ReelView: React.FC<{ r: ReelDef }> = ({ r }) => {
  const total = frames(r);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <style>{fontCss}</style>
      <Backdrop />
      <Audio src={staticFile(r.vo)} />
      <Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, total - 30, total], [0.12, 0.12, 0], { extrapolateRight: "clamp" })} />
      {r.beats.map((b, i) => {
        const from = Math.round((i === 0 ? 0 : r.t.starts[i] - 0.12) * FPS);
        const to = i + 1 < r.beats.length ? Math.round((r.t.starts[i + 1] - 0.12) * FPS) : total;
        const capFrom = Math.round(r.t.starts[i] * FPS);
        const capDur = Math.round(((r.t.starts[i + 1] ?? r.t.end) - r.t.starts[i]) * FPS);
        return (
          <React.Fragment key={i}>
            <Sequence from={from} durationInFrames={to - from}>
              {b.scene}
              {b.card && <TopCard text={b.card} />}
            </Sequence>
            {i < r.beats.length - 1 && (
              <Sequence from={capFrom} durationInFrames={capDur}><Caption text={b.line} dur={capDur} /></Sequence>
            )}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 60, top: 160, fontFamily: "Mono", fontSize: 28, color: C.mute, letterSpacing: 3 }}>@STARXMARKETING</div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <>
    {[REEL03, REEL04].map((r) => (
      <Composition key={r.id} id={r.id} component={() => <ReelView r={r} />} durationInFrames={frames(r)} fps={FPS} width={1080} height={1920} />
    ))}
  </>
);
