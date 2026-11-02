import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { ramp, sec } from "../../shared/motion";
import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

const { beats, total } = buildTimeline(words.lines, timing.timing as Record<string, number>, words.pacing);
export const S09_FRAMES = total;

const SPEND = { Germany: 8306, Spain: 4935 };
const n = (v: number) => Math.round(v).toLocaleString("en-GB");

const SpendRow: React.FC<{ code: string; name: string; top: number; width: number; colour: string; label: string }> = ({ code, name, top, width, colour, label }) => (
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

const YearsRow: React.FC<{ code: string; name: string; top: number; value: string; colour: string; opacity: number }> = ({ code, name, top, value, colour, opacity }) => (
  <div style={{ position: "absolute", left: 70, top, display: "flex", alignItems: "center", gap: 22, opacity, transform: `translateY(${(1 - opacity) * 16}px)` }}>
    <Flag code={code} size={84} />
    <div style={{ width: 300, color: C.paper, fontSize: 52, fontWeight: 800 }}>{name}</div>
    <div style={{ color: colour, fontSize: 110, fontWeight: 900, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{value}</div>
  </div>
);

/**
 * Short S09: health spending per person in Germany and Spain, then how long
 * a baby can expect to live in each. Everything sits above y = 1480 and left
 * of x = 930, clear of YouTube's phone overlay.
 */
export const S09: React.FC = () => {
  const frame = useCurrentFrame();
  const line = words.lines[lineIndexAt(words.lines, beats, frame)];
  const captionIn = ramp(frame, beats[line.id].from - sec(0.1), sec(0.25));
  const fillDe = ramp(frame, beats.a.from, sec(1.4));
  const fillEs = ramp(frame, beats.b.from, sec(1.4));
  const years = ramp(frame, beats.d.from - sec(0.3), sec(0.6));
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

      <div style={{ opacity: 1 - years }}>
        <div style={{ position: "absolute", top: 440, left: 70, color: C.slate, fontSize: 30, fontWeight: 700, letterSpacing: "0.12em" }}>HEALTH SPENDING PER PERSON</div>
        <SpendRow code="DE" name="Germany" top={490} width={(SPEND.Germany / 9000) * 600 * fillDe} colour={C.teal} label={`$${n(SPEND.Germany * fillDe)}`} />
        <SpendRow code="ES" name="Spain" top={680} width={(SPEND.Spain / 9000) * 600 * fillEs} colour={C.amber} label={fillEs > 0 ? `$${n(SPEND.Spain * fillEs)}` : ""} />
      </div>
      <div style={{ opacity: years }}>
        <div style={{ position: "absolute", top: 440, left: 70, color: C.slate, fontSize: 30, fontWeight: 700, letterSpacing: "0.12em" }}>YEARS A BABY CAN EXPECT TO LIVE</div>
        <YearsRow code="DE" name="Germany" top={500} value="81.4" colour={C.teal} opacity={ramp(frame, beats.d.from, sec(0.5))} />
        <YearsRow code="ES" name="Spain" top={650} value="83.7" colour={C.amber} opacity={ramp(frame, beats.d.from + beats.d.frames * 0.45, sec(0.5))} />
        <YearsRow code="IT" name="Italy" top={800} value="83.7" colour={C.amber} opacity={ramp(frame, beats.d.from + beats.d.frames * 0.75, sec(0.5))} />
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
      <div style={{ position: "absolute", top: 1440, left: 70, width: 860, color: C.slate, fontSize: 26 }}>Sources: WHO via World Bank; UN WPP 2024 via OWID</div>
      {words.lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.4)}>
          <Html5Audio src={staticFile(`voice/s09/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src="music/terrachart-bed-04.wav" beats={beats} total={total} under={0.08} between={0.28} />
    </AbsoluteFill>
  );
};
