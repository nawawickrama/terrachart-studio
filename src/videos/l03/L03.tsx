import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { LineRace } from "../../shared/LineRace";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { EndScreen, InfoCard, NoteBox, Takeaways, TitleCard } from "../../shared/Overlays";
import { BigStat, Panel, PanelBars, PanelTrend } from "../../shared/Panels";
import { Race, type RaceData } from "../../shared/Race";
import { ramp, sec, window } from "../../shared/motion";
import gdpData from "./data.json";
import hoursData from "./hours.json";
import pop from "./population.json";
import { beats, lineAt, lines, total, yearAt, type Line } from "./timeline";
import words from "./words.json";

const gdp = gdpData as RaceData;
const hours = hoursData as RaceData;
const HERO = "Poland";
const n = (v: number) => Math.round(v).toLocaleString("en-GB");
const dollars = (v: number) => `$${n(v)}`;
const axisDollars = (v: number) => (v === 0 ? "$0" : `$${n(v)}`);
const levelOf = (l: Line | undefined, name: string) => (!l?.focus?.length ? 1 : l.focus.includes(name) ? 2 : 0);
/** In the bar chart amber means Poland only: the other countries in focus are teal, the rest in the background. */
const barLevelOf = (l: Line | undefined, name: string) => (name === HERO ? 2 : l?.focus?.includes(name) ? 1 : 0);

const SOURCES = {
  line: "Source: World Bank, GDP per capita, PPP (constant 2021 international $), NY.GDP.PCAP.PP.KD, updated 8 Oct 2026",
  hours: "Source: Penn World Table (2025) via Our World in Data. Per person: World Bank",
  regions: "Source: Eurostat, GDP per inhabitant in PPS by NUTS 2 region (nama_10r_2gdp), updated 10 Feb 2026",
  population: "Source: UN World Population Prospects 2024 via Our World in Data",
};

/** Whole stretch of lines that share a panel, so it stays up between them. */
const span = (ids: string[]) => ({ from: beats[ids[0]].from, until: beats[ids[ids.length - 1]].until });

export const L03: React.FC = () => {
  const frame = useCurrentFrame();
  const i = lineAt(frame);
  const line = lines[i];
  const prevLine = lines[i - 1];
  const b = beats[line.id];
  const blend = ramp(frame, b.from, sec(0.5));
  const level = (name: string) => levelOf(prevLine, name) + (levelOf(line, name) - levelOf(prevLine, name)) * blend;
  const barLevel = (name: string) => barLevelOf(prevLine, name) + (barLevelOf(line, name) - barLevelOf(prevLine, name)) * blend;
  const year = yearAt(frame);
  // When a line jumps the chart to another year, its note waits until the chart has arrived.
  const moved = line.race.at !== undefined && prevLine && Math.abs(yearAt(b.from) - line.race.at) > 0.01;
  const noteFrom = b.from + (moved ? sec(1.3) : 0);

  const hoursSpan = span(lines.filter((l) => l.view === "hours").map((l) => l.id));
  const hoursOn = ramp(frame, hoursSpan.from - sec(0.6), sec(0.8)) * (1 - ramp(frame, hoursSpan.until - sec(0.2), sec(0.6)));
  const perHour = span(["per_hour"]);
  const regions = span(["regions_a", "regions_b"]);
  const people = span(["pop_a", "pop_b"]);
  const panels = {
    perHour: window(frame, perHour.from - sec(0.2), perHour.until, sec(0.5)),
    regions: window(frame, regions.from - sec(0.2), regions.until, sec(0.5)),
    population: window(frame, people.from - sec(0.2), people.until, sec(0.5)),
  };
  const panelOn = Math.max(panels.perHour, panels.regions, panels.population);
  const cardOpacity = line.card ? window(frame, b.from, b.until) : 0;
  const chartDim = (1 - 0.7 * cardOpacity) * (1 - 0.8 * panelOn);

  const crossings = words.crossings.map((k) => {
    const l = lines.find((x) => x.cross === k.country)!;
    return { ...k, strength: window(frame, beats[l.id].from, beats[l.id].until, sec(0.5)) };
  });
  const takes = lines.filter((l) => l.take).map((l) => ({ from: beats[l.id].from, title: l.take![0], body: l.take![1] }));
  const source =
    panels.regions > 0.5 ? SOURCES.regions : panels.population > 0.5 ? SOURCES.population : hoursOn > 0.5 || panels.perHour > 0.5 ? SOURCES.hours : SOURCES.line;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 80, top: 40, color: C.paper, fontSize: 34, fontWeight: 800 }}>
        {hoursOn > 0.5 ? "Hours worked per worker, 2023" : "How Poland caught up"}
      </div>
      <div style={{ position: "absolute", left: 80, top: 84, color: C.slate, fontSize: 24 }}>
        {hoursOn > 0.5
          ? "Average hours actually worked in a year by each person in work"
          : "GDP per person, adjusted for inflation and for prices in each country (constant 2021 international dollars)"}
      </div>
      <div style={{ position: "absolute", right: 70, top: 36, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
        <Mark size={52} />
        <Wordmark size={34} />
      </div>

      <div style={{ opacity: (1 - hoursOn) * chartDim }}>
        <LineRace
          data={gdp}
          year={year}
          hero={HERO}
          level={level}
          x={170}
          y={200}
          width={1290}
          height={670}
          yMax={70000}
          yStep={10000}
          format={dollars}
          axisFormat={axisDollars}
          markers={words.markers.map((m) => ({ ...m, row: m.year === 2009 ? 1 : 0 }))}
          crossings={crossings}
        />
        <div
          style={{
            position: "absolute",
            right: 1920 - 1450,
            top: 730,
            color: C.paper,
            opacity: 0.85,
            fontSize: 130,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {Math.floor(year + 0.001)}
        </div>
      </div>
      <div style={{ opacity: hoursOn * chartDim }}>
        {hoursOn > 0 && (
          <Race data={hours} year={2023} level={barLevel} x={80} y={200} width={1150} height={700} labelWidth={250} fontSize={26} format={(v) => `${n(v)} h`} axisFormat={n} scaleTop={2000} />
        )}
        {lines
          .filter((l) => l.stat)
          .map((l) => (
            <BigStat key={l.id} value={l.stat![0]} text={l.stat![1]} size={84} style={{ left: 1310, top: 420, width: 540, opacity: window(frame, beats[l.id].from, beats[l.id].until) }} />
          ))}
      </div>

      <div style={{ position: "absolute", left: 80, bottom: 34, color: C.slate, fontSize: 22 }}>{source}</div>
      {line.note && <NoteBox text={line.note} opacity={window(frame, noteFrom, b.until)} at={{ left: 175, top: 795, fontSize: 28, padding: "14px 24px", whiteSpace: "nowrap" }} />}
      {line.card && <InfoCard title={line.card[0]} body={line.card[1]} opacity={cardOpacity} />}

      {panels.perHour > 0 && (
        <Panel opacity={panels.perHour} title="Output per hour worked, 2023" subtitle="GDP divided by all the hours worked, in 2021 international dollars, adjusted for prices" footnote="Per hour: Penn World Table (2025). Per person: World Bank. Both for 2023.">
          <PanelBars
            rows={[
              { label: "Germany", code: "DE", value: 82.5, colour: C.teal },
              { label: "Poland", code: "PL", value: 46.69, colour: C.amber },
            ]}
            max={90}
            width={470}
            labelWidth={240}
            top={220}
            grow={ramp(frame, perHour.from, sec(1.2))}
            format={(v) => `$${v.toFixed(2)}`}
          />
          <BigStat value="57%" text="Poland's output per hour, as a share of Germany's" style={{ left: 930, top: 420, width: 330, opacity: ramp(frame, perHour.from + beats.per_hour.frames * 0.82, sec(0.6)) }} />
          <BigStat value="69%" colour={C.teal} text="Its GDP per person, as a share of Germany's" style={{ left: 930, top: 200, width: 330, opacity: ramp(frame, perHour.from + beats.per_hour.frames * 0.55, sec(0.6)) }} />
        </Panel>
      )}
      {panels.regions > 0 && (
        <Panel opacity={panels.regions} title="Poland's richest and poorest regions" subtitle="GDP per person, adjusted for prices, as a share of the EU average" footnote="PPS: purchasing power standards, Eurostat's unit that takes out price differences. NUTS 2 regions.">
          <PanelBars
            rows={[
              { label: "Warsaw region", value: 155, colour: C.teal, ghost: 108 },
              { label: "Poland", code: "PL", value: 77, colour: C.amber, ghost: 52 },
              { label: "Lubelskie (east)", value: 53, colour: "#1b8f82", ghost: 37 },
            ]}
            max={175}
            width={760}
            labelWidth={320}
            top={230}
            grow={ramp(frame, regions.from, sec(1.2))}
            ghost={ramp(frame, beats.regions_b.from + sec(1.5), sec(0.8))}
            nowLabel="2023"
            ghostLabel="2004"
            format={(v) => `${Math.round(v)}%`}
            reference={{ value: 100, label: "EU average" }}
          />
        </Panel>
      )}
      {panels.population > 0 && (
        <Panel opacity={panels.population} title="Poland's population" subtitle="UN estimates to 2023, then the UN's central projection to 2100" footnote="Central projection: the UN's medium variant. Millions of people.">
          <PanelTrend
            years={pop.years}
            solid={pop.estimate}
            dashed={pop.years.map((yr, k) => (yr === 2023 ? pop.estimate[k] : pop.projection[k]))}
            yMax={45}
            yStep={10}
            draw={ramp(frame, people.from + sec(0.3), beats.pop_a.frames - sec(1))}
            unit={(v) => `${v} m`}
            points={[
              { year: 1990, value: 38.06, label: "38.1 m", below: true },
              { year: 2023, value: 38.76, label: "38.8 m" },
              { year: 2050, value: 32.81, label: "32.8 m" },
              { year: 2100, value: 19.33, label: "19.3 m", below: true },
            ]}
          />
        </Panel>
      )}

      <TitleCard frame={frame} from={beats.hook_c.from} until={beats.hook_c.until} title="How Poland Caught Up" years="1990–2025" tagline="35 years of GDP per person, adjusted for prices" />
      {frame >= beats.take_1.from - sec(0.6) && (
        <Takeaways frame={frame} takes={takes} nextFrom={beats.next.from} next={["Next: Life expectancy in Europe, 1950–2023", "Then: Who works the longest hours in Europe?"]} />
      )}
      {frame >= beats.end.from - sec(0.4) && <EndScreen frame={frame} from={beats.end.from} sources="Sources in the description · The world, charted through time." />}

      {lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.5)}>
          <Html5Audio src={staticFile(`voice/l03/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={words.music.file} beats={beats} total={total} />
    </AbsoluteFill>
  );
};
