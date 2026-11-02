import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../brand";
import { Mark, Wordmark } from "./Logo";
import { ramp, sec, window } from "./motion";

/** A one-line caption, by default on the right, clear of the short bars at the bottom of a race. */
export const NoteBox: React.FC<{ text: string; opacity: number; at?: React.CSSProperties }> = ({ text, opacity, at = { right: 90, top: 560, maxWidth: 820 } }) => (
  <div
    style={{
      position: "absolute",
      padding: "18px 28px",
      background: "rgba(8, 19, 31, 0.88)",
      borderLeft: `6px solid ${C.amber}`,
      borderRadius: 8,
      color: C.paper,
      fontSize: 32,
      fontWeight: 600,
      ...at,
      opacity,
      transform: `translateY(${(1 - opacity) * 12}px)`,
    }}
  >
    {text}
  </div>
);

/** An explanation card on the right. */
export const InfoCard: React.FC<{ title: string; body: string; opacity: number }> = ({ title, body, opacity }) => (
  <div
    style={{
      position: "absolute",
      right: 90,
      top: 500,
      width: 740,
      padding: "40px 46px",
      background: C.panel,
      border: "1px solid rgba(244, 241, 234, 0.12)",
      borderRadius: 18,
      opacity,
      transform: `translateX(${(1 - opacity) * 30}px)`,
      boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
    }}
  >
    <div style={{ color: C.amber, fontSize: 46, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</div>
    <div style={{ marginTop: 18, color: C.paper, fontSize: 32, lineHeight: 1.35 }}>{body}</div>
  </div>
);

/** A solid background that covers the chart. */
export const Scrim: React.FC<{ opacity: number; children: React.ReactNode }> = ({ opacity, children }) => (
  <AbsoluteFill style={{ background: C.navyDeep, opacity }}>{children}</AbsoluteFill>
);

/** The title card, shown across one line of narration. */
export const TitleCard: React.FC<{ frame: number; from: number; until: number; title: string; years: string; tagline: string }> = ({
  frame,
  from,
  until,
  title,
  years,
  tagline,
}) => (
  <Scrim opacity={window(frame, from, until, sec(0.6))}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26, fontFamily: FONT }}>
      <Mark size={150} />
      <div style={{ color: C.paper, fontSize: 104, fontWeight: 800, letterSpacing: "-0.03em" }}>{title}</div>
      <div style={{ color: C.amber, fontSize: 72, fontWeight: 800 }}>{years}</div>
      <div style={{ color: C.slate, fontSize: 40, fontWeight: 500 }}>{tagline}</div>
    </AbsoluteFill>
  </Scrim>
);

/**
 * Three takeaways that appear one by one, then what's next on the channel.
 * It never fades out: the end screen fades in on top, so the chart never
 * shows through between them.
 */
export const Takeaways: React.FC<{
  frame: number;
  takes: { from: number; title: string; body: string }[];
  nextFrom: number;
  next: string[];
}> = ({ frame, takes, nextFrom, next }) => {
  const o = ramp(frame, takes[0].from - sec(0.5), sec(0.6));
  const nextOn = ramp(frame, nextFrom, sec(0.6));
  return (
    <Scrim opacity={o}>
      <div style={{ fontFamily: FONT }}>
        <div style={{ position: "absolute", left: 200, top: 110, color: C.slate, fontSize: 34, fontWeight: 700, letterSpacing: "0.16em" }}>
          THREE THINGS TO TAKE AWAY
        </div>
        {takes.map((t, i) => {
          const show = ramp(frame, t.from - sec(0.2), sec(0.5));
          return (
            <div
              key={t.title}
              style={{ position: "absolute", left: 200, top: 190 + i * 170, display: "flex", gap: 34, opacity: show * (1 - 0.45 * nextOn), transform: `translateY(${(1 - show) * 20}px)` }}
            >
              <div style={{ width: 86, height: 86, borderRadius: 43, background: C.amber, color: C.navy, fontSize: 48, fontWeight: 800, display: "grid", placeItems: "center", flex: "none" }}>
                {i + 1}
              </div>
              <div>
                <div style={{ color: C.paper, fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em" }}>{t.title}</div>
                <div style={{ color: C.slate, fontSize: 32, marginTop: 8 }}>{t.body}</div>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 200, top: 730, width: 1520, padding: "30px 40px", borderRadius: 16, background: C.panel, borderLeft: `8px solid ${C.teal}`, opacity: nextOn }}>
          <div style={{ color: C.teal, fontSize: 30, fontWeight: 700, letterSpacing: "0.12em" }}>NEXT ON TERRACHART</div>
          {next.map((n, i) => (
            <div key={n} style={{ color: C.paper, fontSize: 40, fontWeight: 700, marginTop: i ? 6 : 10 }}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </Scrim>
  );
};

/** The last 20-odd seconds: room for YouTube's end-screen video and subscribe button. */
export const EndScreen: React.FC<{ frame: number; from: number; sources: string }> = ({ frame, from, sources }) => (
  <AbsoluteFill style={{ background: C.navy, opacity: ramp(frame, from - sec(0.3), sec(0.6)), fontFamily: FONT }}>
    <div style={{ position: "absolute", top: 90, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      <Mark size={110} />
      <Wordmark size={88} />
    </div>
    <div style={{ position: "absolute", left: 170, top: 300, color: C.slate, fontSize: 30, fontWeight: 700, letterSpacing: "0.14em" }}>WATCH NEXT</div>
    <div style={{ position: "absolute", left: 170, top: 350, width: 880, height: 495, borderRadius: 18, border: "3px dashed rgba(141, 162, 184, 0.45)" }} />
    <div style={{ position: "absolute", left: 1270, top: 300, color: C.slate, fontSize: 30, fontWeight: 700, letterSpacing: "0.14em" }}>SUBSCRIBE</div>
    <div style={{ position: "absolute", left: 1290, top: 380, width: 400, height: 400, borderRadius: 200, border: "3px dashed rgba(141, 162, 184, 0.45)" }} />
    <div style={{ position: "absolute", bottom: 70, width: "100%", textAlign: "center", color: C.slate, fontSize: 30 }}>{sources}</div>
  </AbsoluteFill>
);
