import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../brand";
import { Mark, Wordmark } from "./Logo";
import { MusicBed } from "./MusicBed";
import { Race, type RaceData } from "./Race";
import { ramp, sec } from "./motion";
import { buildTimeline, type Pacing } from "./timeline";
import { lineIndexAt, yearTrack, type RaceLine } from "./yearTrack";

export type StageWords = {
  title: string;
  subtitle: string;
  /** The countries shown, and which of them are drawn in amber. */
  countries: string[];
  focus: string[];
  pacing: Pacing;
  lines: (RaceLine & { say: string })[];
};

/** Everything a stage Short needs, worked out once from its words and timing. */
export function stageTimeline(words: StageWords, timing: Record<string, number>) {
  const { beats, total } = buildTimeline(words.lines, timing, words.pacing);
  return { beats, total, stageAt: yearTrack(words.lines, beats) };
}

const n = (v: number) => Math.round(v).toLocaleString("en-GB");

/**
 * A vertical Short that ranks a few countries one way (stage 0, euros) and
 * then another (stage 1, buying power), with the narration as captions.
 * Everything sits above y = 1480 and left of x = 930, clear of the title,
 * channel and buttons YouTube draws over a Short on phones.
 */
export const StageShort: React.FC<{
  words: StageWords;
  timing: Record<string, number>;
  data: RaceData;
  voiceDir: string;
  source: string;
  music: string;
  labels: [string, string];
}> = ({ words, timing, data, voiceDir, source, music, labels }) => {
  const frame = useCurrentFrame();
  const { beats, total, stageAt } = stageTimeline(words, timing);
  const stage = stageAt(frame);
  const trail = Array.from({ length: 9 }, (_, k) => stageAt(frame - 8 + k));
  const shown = { ...data, countries: data.countries.filter((c) => words.countries.includes(c.name)) };
  const line = words.lines[lineIndexAt(words.lines, beats, frame)];
  const captionIn = ramp(frame, beats[line.id].from - sec(0.1), sec(0.25));
  const fmt = stage < 0.5 ? (v: number) => `€${n(v)}` : (v: number) => `${n(v)} PPS`;
  const rows = words.countries.length;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy}, ${C.navyDeep})`, fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 150, left: 70, right: 70, display: "flex", alignItems: "center", gap: 14 }}>
        <Mark size={58} />
        <Wordmark size={42} />
      </div>
      <div style={{ position: "absolute", top: 250, left: 70, right: 70 }}>
        <div style={{ color: C.amber, fontSize: 80, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>{words.title}</div>
        <div style={{ marginTop: 14, color: C.slate, fontSize: 36 }}>{words.subtitle}</div>
      </div>
      <Race
        data={shown}
        year={stage}
        trail={trail}
        level={(name) => (words.focus.includes(name) ? 2 : 1)}
        x={40}
        y={520}
        width={990}
        height={rows * 100}
        labelWidth={250}
        fontSize={36}
        axis={false}
        format={fmt}
      />
      <div style={{ position: "absolute", top: 545 + rows * 100, left: 70, fontWeight: 900, fontSize: 84, letterSpacing: "-0.03em", lineHeight: 1 }}>
        <div style={{ color: C.paper, opacity: Math.max(0, 1 - 2 * stage) }}>{labels[0]}</div>
        <div style={{ color: C.amber, opacity: Math.max(0, 2 * stage - 1), marginTop: -84 }}>{labels[1]}</div>
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
