import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { ramp, sec, window } from "../../shared/motion";
import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

const { beats, total } = buildTimeline(words.lines, timing.timing as Record<string, number>, words.pacing);
export const S07_FRAMES = total;

const HOURS = { Poland: 1807, Germany: 1335 };
const PER_HOUR = { Poland: 46.69, Germany: 82.5 };
const n = (v: number) => Math.round(v).toLocaleString("en-GB");

const Row: React.FC<{ code: string; name: string; top: number; width: number; colour: string; label: string }> = ({ code, name, top, width, colour, label }) => (
  <div style={{ position: "absolute", left: 70, top }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, color: C.paper, fontSize: 46, fontWeight: 800 }}>
      <Flag code={code} size={64} />
      {name}
    </div>
    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: width > 0 ? Math.max(12, width) : 0, height: 90, borderRadius: "6px 45px 45px 6px", background: colour }} />
      <div style={{ color: C.paper, fontSize: 48, fontWeight: 800, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  </div>
);

/**
 * Short S07: hours worked a year in Poland and Germany, the twelve extra
 * working weeks, then output per hour. Everything sits above y = 1480 and
 * left of x = 930, clear of YouTube's phone overlay.
 */
export const S07: React.FC = () => {
  const frame = useCurrentFrame();
  const line = words.lines[lineIndexAt(words.lines, beats, frame)];
  const captionIn = ramp(frame, beats[line.id].from - sec(0.1), sec(0.25));
  const perHour = ramp(frame, beats.e.from - sec(0.3), sec(0.6));
  const fillPl = ramp(frame, beats.a.from, sec(1.4));
  const fillDe = ramp(frame, beats.b.from, sec(1.4));
  const growHour = ramp(frame, beats.e.from + sec(0.2), sec(1.4));
  const weeks = window(frame, beats.c.from, beats.d.from, sec(0.4));
  const share = window(frame, beats.d.from, beats.e.from, sec(0.4));
  const perHourShare = ramp(frame, beats.f.from, sec(0.5));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy}, ${C.navyDeep})`, fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 150, left: 70, right: 70, display: "flex", alignItems: "center", gap: 14 }}>
        <Mark size={58} />
        <Wordmark size={42} />
      </div>
      <div style={{ position: "absolute", top: 250, left: 70, right: 70 }}>
        <div style={{ color: C.amber, fontSize: 84, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>{words.title}</div>
        <div style={{ marginTop: 14, color: C.slate, fontSize: 36 }}>{words.subtitle}</div>
      </div>

      <div style={{ opacity: 1 - perHour }}>
        <div style={{ position: "absolute", top: 440, left: 70, color: C.slate, fontSize: 30, fontWeight: 700, letterSpacing: "0.12em" }}>HOURS WORKED A YEAR</div>
        <Row code="PL" name="Poland" top={490} width={(HOURS.Poland / 2000) * 640 * fillPl} colour={C.amber} label={`${n(HOURS.Poland * fillPl)} h`} />
        <Row code="DE" name="Germany" top={680} width={(HOURS.Germany / 2000) * 640 * fillDe} colour={C.teal} label={fillDe > 0 ? `${n(HOURS.Germany * fillDe)} h` : ""} />
      </div>
      <div style={{ opacity: perHour }}>
        <div style={{ position: "absolute", top: 440, left: 70, color: C.slate, fontSize: 30, fontWeight: 700, letterSpacing: "0.12em" }}>OUTPUT PER HOUR WORKED</div>
        <Row code="PL" name="Poland" top={490} width={(PER_HOUR.Poland / 90) * 640 * growHour} colour={C.amber} label={`$${(PER_HOUR.Poland * growHour).toFixed(2)}`} />
        <Row code="DE" name="Germany" top={680} width={(PER_HOUR.Germany / 90) * 640 * growHour} colour={C.teal} label={`$${(PER_HOUR.Germany * growHour).toFixed(2)}`} />
      </div>

      <div style={{ position: "absolute", top: 880, left: 70, width: 860, opacity: weeks }}>
        <div style={{ color: C.paper, fontSize: 40, fontWeight: 800 }}>
          = <span style={{ color: C.amber }}>12</span> extra 40-hour weeks
        </div>
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(6, 120px)", gap: 14 }}>
          {Array.from({ length: 12 }, (_, k) => {
            const on = ramp(frame, beats.c.from + sec(1.6) + k * sec(0.12), sec(0.2));
            return (
              <div
                key={k}
                style={{
                  height: 64,
                  borderRadius: 10,
                  background: C.amber,
                  opacity: on,
                  transform: `scale(${0.6 + 0.4 * on})`,
                  color: C.navy,
                  fontSize: 24,
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                40 h
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", top: 880, left: 70, width: 860, opacity: share }}>
        <div style={{ color: C.teal, fontSize: 130, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>75%</div>
        <div style={{ marginTop: 12, color: C.paper, fontSize: 36, fontWeight: 600 }}>Poland's GDP per person as a share of Germany's, 2025</div>
      </div>
      <div style={{ position: "absolute", top: 880, left: 70, width: 860, opacity: perHourShare }}>
        <div style={{ color: C.amber, fontSize: 130, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>57%</div>
        <div style={{ marginTop: 12, color: C.paper, fontSize: 36, fontWeight: 600 }}>Poland's output per hour as a share of Germany's, 2023</div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1160,
          left: 70,
          width: 860,
          padding: "26px 32px",
          borderRadius: 18,
          background: "rgba(8, 19, 31, 0.9)",
          borderLeft: `8px solid ${C.amber}`,
          color: C.paper,
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.25,
          opacity: captionIn,
          boxSizing: "border-box",
        }}
      >
        {line.say}
      </div>
      <div style={{ position: "absolute", top: 1440, left: 70, width: 860, color: C.slate, fontSize: 26 }}>
        Sources: Penn World Table 2025 (via OWID), World Bank
      </div>
      {words.lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.4)}>
          <Html5Audio src={staticFile(`voice/s07/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src="music/terrachart-bed-03.wav" beats={beats} total={total} under={0.08} between={0.28} />
    </AbsoluteFill>
  );
};
