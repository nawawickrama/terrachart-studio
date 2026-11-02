import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { EndScreen, InfoCard, NoteBox, Takeaways, TitleCard } from "../../shared/Overlays";
import { Race, type RaceData } from "../../shared/Race";
import { ramp, sec, window } from "../../shared/motion";
import growthData from "./growth.json";
import rankData from "./rank.json";
import { beats, lineAt, lines, stageAt, total, yearAt, type Line } from "./timeline";
import words from "./words.json";

const rank = rankData as RaceData;
const growth = growthData as RaceData;
const levelOf = (l: Line | undefined, name: string) => (!l?.focus?.length ? 1 : l.focus.includes(name) ? 2 : 0);
const n = (v: number) => Math.round(v).toLocaleString("en-GB");
const euro = (v: number) => `€${n(v)}`;
const pps = (v: number) => `${n(v)} PPS`;

const CHART = { x: 80, y: 170, width: 1700, height: 750, labelWidth: 230, fontSize: 22 };

export const L02: React.FC = () => {
  const frame = useCurrentFrame();
  const i = lineAt(frame);
  const line = lines[i];
  const prevLine = lines[i - 1];
  const b = beats[line.id];
  const blend = ramp(frame, b.from, sec(0.5));
  const level = (name: string) => levelOf(prevLine, name) + (levelOf(line, name) - levelOf(prevLine, name)) * blend;

  // Cross-fade from the euro/PPS ranking to the 2016–2026 race at the first growth line.
  const growthOn = ramp(frame, beats.growth_intro.from - sec(0.6), sec(0.8));
  const stage = stageAt(frame);
  const year = yearAt(frame);
  const stageTrail = Array.from({ length: 9 }, (_, k) => stageAt(frame - 8 + k));
  const yearTrail = Array.from({ length: 9 }, (_, k) => yearAt(frame - 8 + k));
  const inPps = stage >= 0.5;

  const cardOpacity = line.card ? window(frame, b.from, b.until) : 0;
  const chartDim = 1 - 0.7 * cardOpacity;
  const takes = lines.filter((l) => l.take).map((l) => ({ from: beats[l.id].from, title: l.take![0], body: l.take![1] }));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 80, top: 40, color: C.paper, fontSize: 34, fontWeight: 800 }}>Minimum wages in the EU</div>
      <div style={{ position: "absolute", left: 80, top: 84, color: C.slate, fontSize: 24 }}>
        {growthOn > 0.5
          ? "Gross monthly minimum wage in euros, every July"
          : inPps
            ? "Gross monthly minimum wage, July 2026, in purchasing power standards"
            : "Gross monthly minimum wage, July 2026, in euros"}
      </div>
      <div style={{ position: "absolute", right: 70, top: 36, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
        <Mark size={52} />
        <Wordmark size={34} />
      </div>

      <div style={{ opacity: (1 - growthOn) * chartDim }}>
        <Race data={rank} year={stage} trail={stageTrail} level={level} {...CHART} format={inPps ? pps : euro} axisFormat={inPps ? pps : euro} />
        <div style={{ position: "absolute", right: 90, bottom: 80, textAlign: "right", fontWeight: 800, lineHeight: 1 }}>
          {/* One label fades out completely before the other fades in, so they never overlap. */}
          <div style={{ color: C.paper, fontSize: 92, opacity: Math.max(0, 1 - 2 * stage), letterSpacing: "-0.03em" }}>In euros</div>
          <div style={{ color: C.amber, fontSize: 92, opacity: Math.max(0, 2 * stage - 1), marginTop: -92, letterSpacing: "-0.03em" }}>In buying power</div>
        </div>
      </div>
      <div style={{ opacity: growthOn * chartDim }}>
        {growthOn > 0 && <Race data={growth} year={year} trail={yearTrail} level={level} {...CHART} format={euro} axisFormat={euro} />}
        <div style={{ position: "absolute", right: 90, bottom: 70, color: C.paper, opacity: 0.9, fontSize: 190, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {Math.floor(year + 0.001)}
        </div>
      </div>

      <div style={{ position: "absolute", left: 80, bottom: 34, color: C.slate, fontSize: 22 }}>
        {growthOn > 0.5
          ? "Source: Eurostat (earn_mw_cur), July of each year, euros at each year's prices. Cyprus from 2023."
          : "Source: Eurostat (earn_mw_cur), July 2026. PPS = purchasing power standards. 14 payments a year spread over 12 months."}
      </div>
      {line.note && <NoteBox text={line.note} opacity={window(frame, b.from, b.until)} at={{ left: 80, bottom: 66, fontSize: 28, padding: "14px 24px", whiteSpace: "nowrap" }} />}
      {line.card && <InfoCard title={line.card[0]} body={line.card[1]} opacity={cardOpacity} />}
      <TitleCard frame={frame} from={beats.hook_c.from} until={beats.hook_c.until} title="Minimum Wages in the EU" years="July 2026" tagline="What they really buy, and how fast they're rising" />
      {frame >= beats.take_1.from - sec(0.6) && (
        <Takeaways frame={frame} takes={takes} nextFrom={beats.next.from} next={["Next: How Poland caught up", "Then: How long Europeans live"]} />
      )}
      {frame >= beats.end.from - sec(0.4) && <EndScreen frame={frame} from={beats.end.from} sources="Sources in the description · The world, charted through time." />}

      {lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.5)}>
          <Html5Audio src={staticFile(`voice/l02/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={words.music.file} beats={beats} total={total} />
    </AbsoluteFill>
  );
};
