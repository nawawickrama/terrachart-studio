import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { LineRace } from "../../shared/LineRace";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { EndScreen, InfoCard, NoteBox, Takeaways, TitleCard } from "../../shared/Overlays";
import { Panel, PanelBars } from "../../shared/Panels";
import { Race, type RaceData } from "../../shared/Race";
import { ramp, sec, window } from "../../shared/motion";
import linesData from "./lines.json";
import rankData from "./rank.json";
import { beats, lineAt, lines, total, yearAt, type Line } from "./timeline";
import words from "./words.json";

const rank = rankData as RaceData;
const longRace = linesData as RaceData;
const HERO = "Germany";
const levelOf = (l: Line | undefined, name: string) => (!l?.focus?.length ? 1 : l.focus.includes(name) ? 2 : 0);
const n = (v: number) => Math.round(v).toLocaleString("en-GB");

const CHART = { x: 80, y: 175, width: 1260, height: 780, labelWidth: 220, fontSize: 19 };
const SOURCES = {
  main: "Source: Penn World Table (2025) via Our World in Data. Hours actually worked per worker, including part-time workers",
  long: "Sources: Huberman and Minns (2005) for 1870; Penn World Table (2025) for 2023; both via Our World in Data",
  hour: "Source: Penn World Table (2025) via Our World in Data. GDP per hour worked, adjusted for prices",
};

/** The stretches of the video where each view or panel is on screen, so they cross-fade only when they change. */
const spans = (is: (l: Line) => boolean) => {
  const out: { from: number; until: number }[] = [];
  lines.forEach((l, i) => {
    if (!is(l)) return;
    if (i > 0 && is(lines[i - 1])) out[out.length - 1].until = beats[l.id].until;
    else out.push({ from: beats[l.id].from, until: beats[l.id].until });
  });
  return out;
};
const SPANS = {
  rank: spans((l) => l.view === "rank"),
  lines: spans((l) => l.view === "lines"),
  long: spans((l) => l.panel === "long"),
  hour: spans((l) => l.panel === "hour"),
  us: spans((l) => l.panel === "us"),
  asia: spans((l) => l.panel === "asia"),
};

export const L05: React.FC = () => {
  const frame = useCurrentFrame();
  const i = lineAt(frame);
  const line = lines[i];
  const prevLine = lines[i - 1];
  const b = beats[line.id];
  const blend = ramp(frame, b.from, sec(0.5));
  const level = (name: string) => levelOf(prevLine, name) + (levelOf(line, name) - levelOf(prevLine, name)) * blend;
  const year = yearAt(frame);

  const on = (k: keyof typeof SPANS) =>
    Math.max(0, ...SPANS[k].map((s) => ramp(frame, s.from - sec(0.3), sec(0.6)) * (1 - ramp(frame, s.until - sec(0.3), sec(0.6)))));
  const rankOn = on("rank");
  const linesOn = on("lines");
  const panels = { long: on("long"), hour: on("hour"), us: on("us"), asia: on("asia") };
  const panelOn = Math.max(...Object.values(panels));
  const cardOpacity = line.card ? window(frame, b.from, b.until) : 0;
  const dim = (1 - 0.7 * cardOpacity) * (1 - 0.92 * panelOn);

  // A line that jumps the chart to another year shows its note once the chart has arrived.
  const moved = line.view === "lines" && line.race.at !== undefined && prevLine && Math.abs(yearAt(b.from) - line.race.at) > 0.01;
  const noteOpacity = window(frame, b.from + (moved ? sec(1.3) : 0), b.until);
  const takes = lines.filter((l) => l.take).map((l) => ({ from: beats[l.id].from, title: l.take![0], body: l.take![1] }));
  const source = line.panel === "long" ? SOURCES.long : line.panel === "hour" ? SOURCES.hour : SOURCES.main;
  const usGhost = ramp(frame, beats.us_b.from, sec(0.8));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 80, top: 40, color: C.paper, fontSize: 34, fontWeight: 800 }}>Who works the longest hours in Europe?</div>
      <div style={{ position: "absolute", left: 80, top: 84, color: C.slate, fontSize: 24 }}>
        {linesOn > 0.5 ? "Hours worked in a year by the average worker, 1970–2023" : "Hours worked in a year by the average worker, 2023"}
      </div>
      <div style={{ position: "absolute", right: 70, top: 36, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
        <Mark size={52} />
        <Wordmark size={34} />
      </div>

      {rankOn > 0 && (
        <div style={{ opacity: rankOn * dim }}>
          <Race data={rank} year={2023} level={level} {...CHART} format={n} axisFormat={n} scaleTop={2100} />
          <div style={{ position: "absolute", right: 90, bottom: 80, color: C.paper, opacity: 0.85, fontSize: 150, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            2023
          </div>
        </div>
      )}
      {linesOn > 0 && (
        <div style={{ opacity: linesOn * dim }}>
          <LineRace
            data={longRace}
            year={year}
            hero={HERO}
            level={level}
            x={170}
            y={200}
            width={1290}
            height={670}
            yMin={1200}
            yMax={2400}
            yStep={200}
            xStep={10}
            format={n}
            axisFormat={n}
          />
          <div style={{ position: "absolute", right: 1920 - 1450, top: 195, color: C.paper, opacity: 0.85, fontSize: 130, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {Math.floor(year + 0.001)}
          </div>
        </div>
      )}

      <div style={{ position: "absolute", left: 80, bottom: 34, color: C.slate, fontSize: 22 }}>{source}</div>
      {line.note &&
        (line.view === "lines" ? (
          <NoteBox text={line.note} opacity={noteOpacity} at={{ left: 175, top: 795, fontSize: 28, padding: "14px 24px", whiteSpace: "nowrap" }} />
        ) : (
          <NoteBox text={line.note} opacity={noteOpacity} at={{ right: 90, top: 470, width: 470, fontSize: 30, padding: "18px 26px", lineHeight: 1.3, boxSizing: "border-box" }} />
        ))}
      {line.card && <InfoCard title={line.card[0]} body={line.card[1]} opacity={cardOpacity} />}

      {panels.long > 0 && (
        <Panel opacity={panels.long} title="Hours worked in a year, 1870 and 2023" subtitle="Before 1950: full-time workers outside farming only, so not an exact match" footnote="1870: Huberman and Minns (2005). 2023: Penn World Table (2025). Both via Our World in Data.">
          <PanelBars
            rows={[
              { label: "Germany", code: "DE", value: 1335, colour: C.amber, ghost: 3284 },
              { label: "France", code: "FR", value: 1487, colour: C.teal, ghost: 3168 },
              { label: "United States", value: 1789, colour: C.teal, ghost: 3096 },
              { label: "United Kingdom", code: "GB", value: 1523, colour: C.teal, ghost: 2755 },
            ]}
            max={3500}
            width={640}
            labelWidth={330}
            top={170}
            grow={ramp(frame, beats.long_a.from, sec(1.2))}
            ghost={ramp(frame, beats.long_a.from + sec(0.6), sec(0.8))}
            ghostLabel="1870"
            nowLabel="2023"
            format={n}
          />
        </Panel>
      )}
      {panels.hour > 0 && (
        <Panel opacity={panels.hour} title="Output per hour worked, 2023" subtitle="GDP divided by all the hours worked, in 2021 international dollars, adjusted for prices" footnote="Penn World Table (2025) via Our World in Data. The OECD's figures show a similar gap.">
          <PanelBars
            rows={[
              { label: "United States", value: 83.5, colour: C.teal },
              { label: "Germany", code: "DE", value: 82.5, colour: C.amber },
              { label: "Poland", code: "PL", value: 46.7, colour: C.teal },
              { label: "Greece", code: "GR", value: 37.7, colour: C.teal },
            ]}
            max={95}
            width={680}
            labelWidth={330}
            top={170}
            grow={ramp(frame, beats.hour_a.from, sec(1.2))}
            format={(v) => `$${Math.round(v)}`}
          />
        </Panel>
      )}
      {panels.us > 0 && (
        <Panel opacity={panels.us} title="Europe and the United States" subtitle="Hours worked in a year by the average worker" footnote="Penn World Table (2025) via Our World in Data. Poland: no figure for 1970.">
          <PanelBars
            rows={[
              { label: "Greece", code: "GR", value: 1893, colour: C.teal, ghost: 2114 },
              { label: "Poland", code: "PL", value: 1807, colour: C.teal },
              { label: "United States", value: 1789, colour: C.amber, ghost: 1931 },
              { label: "Germany", code: "DE", value: 1335, colour: C.teal, ghost: 1972 },
            ]}
            max={2400}
            width={640}
            labelWidth={330}
            top={170}
            grow={ramp(frame, beats.us_a.from, sec(1.2))}
            ghost={usGhost}
            ghostLabel="1970"
            nowLabel="2023"
            format={n}
          />
        </Panel>
      )}
      {panels.asia > 0 && (
        <Panel opacity={panels.asia} title="And in Asia" subtitle="Hours worked in a year by the average worker" footnote="Penn World Table (2025) via Our World in Data.">
          <PanelBars
            rows={[
              { label: "South Korea", value: 1910, colour: C.amber, ghost: 2919 },
              { label: "Poland", code: "PL", value: 1807, colour: C.teal },
              { label: "Italy", code: "IT", value: 1701, colour: C.teal },
              { label: "Japan", value: 1654, colour: C.amber, ghost: 2185 },
            ]}
            max={3100}
            width={640}
            labelWidth={330}
            top={170}
            grow={ramp(frame, beats.asia.from, sec(1.2))}
            ghost={ramp(frame, beats.asia.from + sec(0.6), sec(0.8))}
            ghostLabel="1970"
            nowLabel="2023"
            format={n}
          />
        </Panel>
      )}

      <TitleCard frame={frame} from={beats.hook_c.from} until={beats.hook_c.until} title="Who Works the Longest Hours?" years="Europe, 2023" tagline="And does it pay?" />
      {frame >= beats.take_1.from - sec(0.6) && (
        <Takeaways frame={frame} takes={takes} nextFrom={beats.next.from} next={["Next: Electricity prices in Europe, 2008–2026", "Then: Europe's biggest populations, 1950–2100"]} />
      )}
      {frame >= beats.end.from - sec(0.4) && <EndScreen frame={frame} from={beats.end.from} sources="Sources in the description · The world, charted through time." />}

      {lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.5)}>
          <Html5Audio src={staticFile(`voice/l05/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={words.music.file} beats={beats} total={total} />
    </AbsoluteFill>
  );
};
