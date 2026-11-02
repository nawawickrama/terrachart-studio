import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { LineRace } from "../../shared/LineRace";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { EndScreen, InfoCard, NoteBox, Takeaways, TitleCard } from "../../shared/Overlays";
import { BigStat, Panel, PanelBars } from "../../shared/Panels";
import type { RaceData } from "../../shared/Race";
import { TileLegend, TileMap, tileValue, type Tile } from "../../shared/TileMap";
import { ramp, sec, window } from "../../shared/motion";
import dipData from "./dip.json";
import linesData from "./lines.json";
import mapData from "./map.json";
import { beats, dipAt, lineAt, lines, total, yearAt, type Line } from "./timeline";
import words from "./words.json";

const longRace = linesData as RaceData;
const dipRace = dipData as RaceData;
const tiles = mapData.tiles as Tile[];
const HERO = "Spain";
const years = (v: number) => v.toFixed(1);
const levelOf = (l: Line | undefined, name: string) => (!l?.focus?.length ? 1 : l.focus.includes(name) ? 2 : 0);

const SOURCES = {
  main: "Source: UN World Population Prospects 2024, via Our World in Data. Life expectancy at birth",
  child: "Source: Gapminder and UN IGME (2025), via Our World in Data. Deaths before the age of five",
  health: "Sources: WHO Global Health Expenditure Database via the World Bank (2023); UN World Population Prospects 2024",
};

/** The stretches of the video where each view is on screen, so views cross-fade only when they change. */
const spans = (view: Line["view"]) => {
  const out: { from: number; until: number }[] = [];
  lines.forEach((l, i) => {
    if (l.view !== view) return;
    if (i > 0 && lines[i - 1].view === view) out[out.length - 1].until = beats[l.id].until;
    else out.push({ from: beats[l.id].from, until: beats[l.id].until });
  });
  return out;
};
const VIEW_SPANS = { map: spans("map"), lines: spans("lines"), dip: spans("dip") };

export const L04: React.FC = () => {
  const frame = useCurrentFrame();
  const i = lineAt(frame);
  const line = lines[i];
  const prevLine = lines[i - 1];
  const b = beats[line.id];
  const blend = ramp(frame, b.from, sec(0.5));
  const level = (name: string) => levelOf(prevLine, name) + (levelOf(line, name) - levelOf(prevLine, name)) * blend;
  const year = yearAt(frame);
  const dipYear = dipAt(frame);

  const on = (v: keyof typeof VIEW_SPANS) =>
    Math.max(0, ...VIEW_SPANS[v].map((s) => ramp(frame, s.from - sec(0.3), sec(0.6)) * (1 - ramp(frame, s.until - sec(0.3), sec(0.6)))));
  const mapOn = on("map");
  const linesOn = on("lines");
  const dipOn = on("dip");
  const health = window(frame, b.from - sec(0.2), b.until, sec(0.5)) * (line.panel === "health" ? 1 : 0);
  const cardOpacity = line.card ? window(frame, b.from, b.until) : 0;
  const dim = (1 - 0.7 * cardOpacity) * (1 - 0.8 * health);

  // A line that jumps the chart to another year shows its note once the chart has arrived.
  const moved = line.race.at !== undefined && prevLine && Math.abs((line.view === "dip" ? dipAt : yearAt)(b.from) - line.race.at) > 0.01;
  const noteOpacity = window(frame, b.from + (moved ? sec(1.3) : 0), b.until);
  const crossings = words.crossings.map((k) => {
    const l = lines.find((x) => x.cross === k.country);
    return { ...k, strength: l ? window(frame, beats[l.id].from, beats[l.id].until, sec(0.5)) : 0 };
  });
  const takes = lines.filter((l) => l.take).map((l) => ({ from: beats[l.id].from, title: l.take![0], body: l.take![1] }));
  const source = line.panel === "health" ? SOURCES.health : line.src === "child" ? SOURCES.child : SOURCES.main;
  const europe = tileValue(mapData.years, mapData.europe, year);
  const counter = (y: number, opacity: number) => (
    <div style={{ position: "absolute", right: 1920 - 1450, top: 730, color: C.paper, opacity: 0.85 * opacity, fontSize: 130, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
      {Math.floor(y + 0.001)}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 80, top: 40, color: C.paper, fontSize: 34, fontWeight: 800 }}>
        {dipOn > 0.5 ? "The pandemic years, close up" : "Life expectancy in Europe"}
      </div>
      <div style={{ position: "absolute", left: 80, top: 84, color: C.slate, fontSize: 24 }}>
        {dipOn > 0.5 ? "Life expectancy at birth, in years, 2015–2023" : "Life expectancy at birth, in years"}
      </div>
      <div style={{ position: "absolute", right: 70, top: 36, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
        <Mark size={52} />
        <Wordmark size={34} />
      </div>

      {mapOn > 0 && (
        <div style={{ opacity: mapOn * dim }}>
          <TileMap tiles={tiles} years={mapData.years} year={year} level={level} x={520} y={160} pitch={100} size={90} />
          <TileLegend x={90} y={200} height={360} label="Life expectancy at birth" />
          <div style={{ position: "absolute", left: 1450, top: 200, width: 400 }}>
            <div style={{ color: C.slate, fontSize: 24, fontWeight: 700, letterSpacing: "0.12em" }}>EUROPE AVERAGE</div>
            <div style={{ marginTop: 8, color: C.paper, fontSize: 84, fontWeight: 900, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {europe.toFixed(1)}
            </div>
            <div style={{ marginTop: 6, color: C.slate, fontSize: 26 }}>years</div>
          </div>
          <div style={{ position: "absolute", left: 1450, top: 760, color: C.paper, opacity: 0.85, fontSize: 150, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {Math.floor(year + 0.001)}
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
            yMin={40}
            yMax={90}
            yStep={10}
            xStep={10}
            format={years}
            axisFormat={(v) => `${v}`}
            crossings={crossings}
          />
          {counter(year, 1)}
        </div>
      )}
      {dipOn > 0 && (
        <div style={{ opacity: dipOn * dim }}>
          <LineRace data={dipRace} year={dipYear} hero={HERO} level={level} x={170} y={200} width={1290} height={670} yMin={64} yMax={86} yStep={2} xStep={1} format={years} axisFormat={(v) => `${v}`} />
          {counter(dipYear, 1)}
        </div>
      )}

      <div style={{ position: "absolute", left: 80, bottom: 34, color: C.slate, fontSize: 22 }}>{source}</div>
      {line.note &&
        (line.view === "map" ? (
          <NoteBox text={line.note} opacity={noteOpacity} at={{ left: 80, top: 660, width: 380, fontSize: 26, padding: "16px 22px", lineHeight: 1.3, boxSizing: "border-box" }} />
        ) : (
          <NoteBox text={line.note} opacity={noteOpacity} at={{ left: 175, top: 795, fontSize: 28, padding: "14px 24px", whiteSpace: "nowrap" }} />
        ))}
      {line.card && <InfoCard title={line.card[0]} body={line.card[1]} opacity={cardOpacity} />}
      {health > 0 && (
        <Panel opacity={health} title="Health spending per person, 2023" subtitle="Current spending on health, in international dollars adjusted for prices" footnote="Life expectancy at birth, 2023: UN World Population Prospects 2024.">
          <PanelBars
            rows={[
              { label: "Germany", code: "DE", value: 8306, colour: C.teal },
              { label: "France", code: "FR", value: 6719, colour: "#1b8f82" },
              { label: "Spain", code: "ES", value: 4935, colour: C.amber },
              { label: "Italy", code: "IT", value: 4866, colour: "#1b8f82" },
            ]}
            max={9000}
            width={430}
            labelWidth={230}
            top={190}
            grow={ramp(frame, b.from, sec(1.2))}
            format={(v) => `$${Math.round(v).toLocaleString("en-GB")}`}
          />
          <BigStat value="81.4" colour={C.teal} text="Years a baby born in Germany can expect to live" size={88} style={{ left: 930, top: 190, width: 330, opacity: ramp(frame, b.from + b.frames * 0.55, sec(0.6)) }} />
          <BigStat value="83.7" text="Years a baby born in Spain can expect to live" size={88} style={{ left: 930, top: 410, width: 330, opacity: ramp(frame, b.from + b.frames * 0.75, sec(0.6)) }} />
        </Panel>
      )}

      <TitleCard frame={frame} from={beats.hook_c.from} until={beats.hook_c.until} title="Life Expectancy in Europe" years="1950–2023" tagline="How the south overtook the north" />
      {frame >= beats.take_1.from - sec(0.6) && (
        <Takeaways frame={frame} takes={takes} nextFrom={beats.next.from} next={["Next: Who works the longest hours in Europe?", "Then: Electricity prices in Europe, 2008–2026"]} />
      )}
      {frame >= beats.end.from - sec(0.4) && <EndScreen frame={frame} from={beats.end.from} sources="Sources in the description · The world, charted through time." />}

      {lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.5)}>
          <Html5Audio src={staticFile(`voice/l04/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={words.music.file} beats={beats} total={total} />
    </AbsoluteFill>
  );
};
