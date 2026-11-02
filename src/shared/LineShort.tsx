import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../brand";
import { LineRace } from "./LineRace";
import { Mark, Wordmark } from "./Logo";
import { MusicBed } from "./MusicBed";
import type { RaceData } from "./Race";
import { ramp, sec, window } from "./motion";
import { buildTimeline, type Pacing } from "./timeline";
import { lineIndexAt, yearTrack, type RaceLine } from "./yearTrack";

export type LineShortWords = {
  title: string;
  subtitle: string;
  /** The countries drawn; the hero's line is amber. */
  countries: string[];
  hero: string;
  crossings: { country: string; year: number }[];
  pacing: Pacing;
  lines: (RaceLine & { say: string; cross?: string })[];
};

/** Everything a line Short needs, worked out once from its words and timing. */
export function lineShortTimeline(words: LineShortWords, timing: Record<string, number>) {
  const { beats, total } = buildTimeline(words.lines, timing, words.pacing);
  return { beats, total, yearAt: yearTrack(words.lines, beats) };
}

const n = (v: number) => Math.round(v).toLocaleString("en-GB");

/**
 * A vertical Short: a few countries' lines racing through time, the hero in
 * amber, rings where it passes the others, and the narration as captions.
 * Everything sits above y = 1480 and left of x = 930, clear of what YouTube
 * draws over a Short on phones.
 */
export const LineShort: React.FC<{
  words: LineShortWords;
  timing: Record<string, number>;
  data: RaceData;
  voiceDir: string;
  source: string;
  music: string;
  yMin: number;
  yMax: number;
  yStep?: number;
  xStep?: number;
  /** How a value reads at the end of a line, and on the axis. Dollars by default. */
  format?: (v: number) => string;
  axisFormat?: (v: number) => string;
}> = ({
  words,
  timing,
  data,
  voiceDir,
  source,
  music,
  yMin,
  yMax,
  yStep = 10000,
  xStep = 10,
  format = (v) => `$${n(v)}`,
  axisFormat = (v) => `$${n(v / 1000)}k`,
}) => {
  const frame = useCurrentFrame();
  const { beats, total, yearAt } = lineShortTimeline(words, timing);
  const year = yearAt(frame);
  const line = words.lines[lineIndexAt(words.lines, beats, frame)];
  const captionIn = ramp(frame, beats[line.id].from - sec(0.1), sec(0.25));
  const crossings = words.crossings.map((k) => {
    const l = words.lines.find((x) => x.cross === k.country);
    return { ...k, strength: l ? window(frame, beats[l.id].from, beats[l.id].until, sec(0.4)) : 0 };
  });
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
      <div style={{ position: "absolute", top: 405, left: 66, color: C.paper, fontSize: 130, fontWeight: 900, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {Math.floor(year + 0.001)}
      </div>
      <LineRace
        data={data}
        only={words.countries}
        year={year}
        hero={words.hero}
        level={() => 2}
        x={160}
        y={570}
        width={450}
        height={530}
        yMin={yMin}
        yMax={yMax}
        yStep={yStep}
        xStep={xStep}
        fontSize={28}
        flagSize={34}
        labelGap={42}
        format={format}
        axisFormat={axisFormat}
        crossings={crossings}
        crossingLabels="highlight"
      />
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
