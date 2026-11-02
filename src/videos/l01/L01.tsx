import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { EndScreen, InfoCard, NoteBox, Takeaways, TitleCard } from "../../shared/Overlays";
import { Race, type RaceData } from "../../shared/Race";
import { ramp, sec, window } from "../../shared/motion";
import data from "./data.json";
import { beats, lineAt, lines, total, yearAt, type Line } from "./timeline";
import words from "./words.json";

const race = data as RaceData;
const levelOf = (l: Line | undefined, name: string) => (!l?.focus?.length ? 1 : l.focus.includes(name) ? 2 : 0);

export const L01: React.FC = () => {
  const frame = useCurrentFrame();
  const i = lineAt(frame);
  const line = lines[i];
  const prevLine = lines[i - 1];
  const b = beats[line.id];
  const blend = ramp(frame, b.from, sec(0.5));
  const level = (name: string) => levelOf(prevLine, name) + (levelOf(line, name) - levelOf(prevLine, name)) * blend;
  const year = yearAt(frame);
  const trail = Array.from({ length: 9 }, (_, k) => yearAt(frame - 8 + k));
  const takes = lines.filter((l) => l.take).map((l) => ({ from: beats[l.id].from, title: l.take![0], body: l.take![1] }));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 80, top: 44, color: C.paper, fontSize: 34, fontWeight: 800, letterSpacing: "-0.01em" }}>
        Europe's biggest economies
      </div>
      <div style={{ position: "absolute", left: 80, top: 88, color: C.slate, fontSize: 24 }}>GDP in US dollars, at each year's prices and exchange rates</div>
      <div style={{ position: "absolute", right: 70, top: 40, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
        <Mark size={52} />
        <Wordmark size={34} />
      </div>
      <Race data={race} year={year} trail={trail} level={level} x={80} y={190} width={1700} height={800} />
      <div
        style={{ position: "absolute", right: 90, bottom: 70, color: C.paper, opacity: 0.9, fontSize: 210, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}
      >
        {Math.floor(year + 0.001)}
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 34, color: C.slate, fontSize: 22 }}>
        Source: World Bank, GDP (current US$). Germany before 1991: World Bank estimate for today's borders. Poland from 1990.
      </div>
      {line.note && <NoteBox text={line.note} opacity={window(frame, b.from, b.until)} />}
      {line.card && <InfoCard title={line.card[0]} body={line.card[1]} opacity={window(frame, b.from, b.until)} />}
      <TitleCard frame={frame} from={beats.hook_c.from} until={beats.hook_c.until} title="Europe's Biggest Economies" years="1970–2025" tagline="Who rose, who fell, and why" />
      {frame >= beats.take_1.from - sec(0.6) && (
        <Takeaways frame={frame} takes={takes} nextFrom={beats.next.from} next={["Next: Minimum wage in every EU country", "Then: How Poland caught up"]} />
      )}
      {frame >= beats.end.from - sec(0.4) && <EndScreen frame={frame} from={beats.end.from} sources="Sources in the description · The world, charted through time." />}

      {lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.5)}>
          <Html5Audio src={staticFile(`voice/l01/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={words.music.file} beats={beats} total={total} />
    </AbsoluteFill>
  );
};
