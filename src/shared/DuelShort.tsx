import React from "react";
import { AbsoluteFill, Easing, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../brand";
import { Flag } from "./Flag";
import { Mark, Wordmark } from "./Logo";
import { MusicBed } from "./MusicBed";
import { money, rowsAt, type RaceData } from "./Race";
import { ramp, sec } from "./motion";
import { buildTimeline, type Pacing } from "./timeline";
import { lineIndexAt, yearTrack, type RaceLine } from "./yearTrack";

export type ShortWords = {
  title: string;
  subtitle: string;
  /** The comparison country first, then the subject (drawn in amber). */
  pair: string[];
  pacing: Pacing;
  lines: (RaceLine & { say: string })[];
};

/** Everything a Short needs, worked out once from its words and timing. */
export function duelTimeline(words: ShortWords, timing: Record<string, number>) {
  const { beats, total } = buildTimeline(words.lines, timing, words.pacing);
  return { beats, total, yearAt: yearTrack(words.lines, beats) };
}

/**
 * A vertical Short: two countries racing, the year, and the narration as
 * captions. Everything sits above y = 1480 and left of x = 930: on phones
 * YouTube draws the title, channel and buttons over the bottom quarter and
 * down the right edge.
 */
export const DuelShort: React.FC<{
  words: ShortWords;
  timing: Record<string, number>;
  data: RaceData;
  voiceDir: string;
  source: string;
  music: string;
}> = ({ words, timing, data, voiceDir, source, music }) => {
  const frame = useCurrentFrame();
  const { beats, total, yearAt } = duelTimeline(words, timing);
  const year = yearAt(frame);
  const rows = rowsAt(data, year, words.pair);
  const top = Math.max(...rows.map((r) => r.value)) * 1.12;
  const line = words.lines[lineIndexAt(words.lines, beats, frame)];
  const b = beats[line.id];
  const captionIn = ramp(frame, b.from - sec(0.1), sec(0.25));
  const [lead, behind] = [...rows].sort((a, z) => z.value - a.value);
  const gap = Math.round(lead.value) - Math.round(behind.value);
  // The two bars change places at the moment one passes the other, sliding over
  // while they are within half a percent of the scale of each other.
  const [first, second] = words.pair.map((name) => rows.find((r) => r.country.name === name)!);
  const swap = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, 0.5 - (first.value - second.value) / top / 0.01)));
  const slot = (name: string) => (name === words.pair[0] ? swap : 1 - swap);
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
      {rows.map((r) => {
        const y = 520 + slot(r.country.name) * 200;
        const w = Math.max(60, (r.value / top) * 720);
        return (
          <div key={r.country.code} style={{ position: "absolute", left: 70, top: y }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, color: C.paper, fontSize: 46, fontWeight: 800 }}>
              <Flag code={r.country.code} size={64} />
              {r.country.name}
            </div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: w, height: 96, borderRadius: "6px 48px 48px 6px", background: r.country.name === words.pair[1] ? C.amber : C.teal }} />
              <div style={{ color: C.paper, fontSize: 50, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{money(r.value)}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 920, left: 70, color: C.slate, fontSize: 38, fontWeight: 600 }}>
        {lead.country.name} ahead by{" "}
        <span style={{ color: C.paper, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{money(gap)}</span>
      </div>
      <div style={{ position: "absolute", top: 975, left: 70, color: C.paper, fontSize: 150, fontWeight: 900, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
        {Math.floor(year + 0.001)}
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
      <div style={{ position: "absolute", top: 1440, left: 70, width: 860, color: C.slate, fontSize: 26 }}>Source: {source}</div>
      {words.lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.4)}>
          <Html5Audio src={staticFile(`${voiceDir}/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={music} beats={beats} total={total} under={0.08} between={0.28} />
    </AbsoluteFill>
  );
};
