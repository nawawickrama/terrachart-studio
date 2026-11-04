import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { LineRace } from "../../shared/LineRace";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { EndScreen, InfoCard, NoteBox, Takeaways, TitleCard } from "../../shared/Overlays";
import { BigStat, Panel, PanelBars } from "../../shared/Panels";
import { Race, type RaceData } from "../../shared/Race";
import { ramp, sec, window } from "../../shared/motion";
import linesData from "./lines.json";
import rankData from "./rank.json";
import { beats, halfOf, lineAt, lineStepAt, lines, rankStepAt, total, yearOf, type Line } from "./timeline";
import words from "./words.json";

const rank = rankData as RaceData;
const priceLines = linesData as RaceData;
const HERO = "EU average";
const levelOf = (l: Line | undefined, name: string) => (!l?.focus?.length ? 1 : l.focus.includes(name) ? 2 : 0);
const cents = (v: number) => `${Math.round(v)}c`;
const euros = (v: number) => `€${Math.round(v).toLocaleString("en-GB")}`;

const CHART = { x: 80, y: 175, width: 1260, height: 780, labelWidth: 220, fontSize: 19 };
const SOURCES = {
  main: "Source: Eurostat (nrg_pc_204). Households using 2,500–4,999 kWh a year, all taxes included, not adjusted for inflation",
  real: "Sources: Eurostat (nrg_pc_204) for electricity; Eurostat (prc_hicp_midx) for prices in general",
  parts: "Source: Eurostat (nrg_pc_204_c). Households using 2,500–4,999 kWh a year, 2025",
};

/** What a kilowatt-hour cost in 2025, in cents, split into its three parts (Eurostat nrg_pc_204_c). */
const PARTS = [
  { label: "EU average", code: "EU", from: "parts_b", energy: 12.46, network: 8.15, taxes: 8.26 },
  { label: "Denmark", code: "DK", from: "parts_c", energy: 9.64, network: 7.9, taxes: 16.59 },
  { label: "Germany", code: "DE", from: "parts_c", energy: 14.81, network: 11.3, taxes: 12.41 },
  { label: "Hungary", code: "HU", from: "parts_d", energy: 2.53, network: 5.96, taxes: 2.29 },
  { label: "Ireland", code: "IE", from: "parts_e", energy: 22.9, network: 12.45, taxes: -1.59 },
];
const PART_COLOURS = { energy: C.amber, network: C.teal, taxes: "#7d8fa6" };

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
  real: spans((l) => l.panel === "real"),
  parts: spans((l) => l.panel === "parts"),
  bill: spans((l) => l.panel === "bill"),
};

/** The big year in the corner, with which half of the year it is. */
const Counter: React.FC<{ step: number; style: React.CSSProperties }> = ({ step, style }) => (
  <div style={{ position: "absolute", color: C.paper, opacity: 0.85, fontFamily: FONT, ...style }}>
    <div style={{ fontSize: 130, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{yearOf(step)}</div>
    <div style={{ marginTop: 6, color: C.slate, fontSize: 34, fontWeight: 700, textAlign: style.right !== undefined ? "right" : "left" }}>{halfOf(step)}</div>
  </div>
);

/** One stacked bar per country: energy, network and taxes, drawn in from the left. */
const PartBars: React.FC<{ frame: number }> = ({ frame }) => {
  const left = 56 + 300;
  const max = 40;
  const width = 700;
  const px = (c: number) => (Math.max(0, c) / max) * width;
  return (
    <>
      <div style={{ position: "absolute", right: 56, top: 60, display: "flex", gap: 26, fontSize: 24, fontWeight: 700, color: C.slate }}>
        {(["energy", "network", "taxes"] as const).map((k) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 16, borderRadius: 8, background: PART_COLOURS[k] }} />
            {k === "energy" ? "Energy" : k === "network" ? "Network" : "Taxes"}
          </span>
        ))}
      </div>
      {PARTS.map((r, i) => {
        const show = ramp(frame, beats[r.from].from, sec(0.9));
        const y = 175 + i * 92;
        const segs = [
          { k: "energy" as const, v: r.energy },
          { k: "network" as const, v: r.network },
          { k: "taxes" as const, v: r.taxes },
        ];
        let at = left;
        const total = r.energy + r.network + r.taxes;
        return (
          <div key={r.label} style={{ opacity: show }}>
            <div style={{ position: "absolute", left: 56, top: y, width: 280, height: 60, display: "flex", alignItems: "center", gap: 14, color: C.paper, fontSize: 30, fontWeight: 700 }}>
              <Flag code={r.code} size={42} />
              <span>{r.label}</span>
            </div>
            {segs.map((s) => {
              const w = px(s.v) * show;
              const x = at;
              at += w;
              return (
                <div
                  key={s.k}
                  style={{ position: "absolute", left: x, top: y, width: w, height: 60, background: PART_COLOURS[s.k], display: "flex", alignItems: "center", justifyContent: "center", color: C.navyDeep, fontSize: 24, fontWeight: 800, fontVariantNumeric: "tabular-nums", overflow: "hidden" }}
                >
                  {px(s.v) >= 60 ? cents(s.v) : ""}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: at + 16, top: y, height: 60, display: "flex", alignItems: "center", gap: 14, color: C.paper, fontSize: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {cents(total)}
              {r.taxes < 0 && <span style={{ color: C.slate, fontSize: 24, fontWeight: 700 }}>taxes −{Math.round(-r.taxes)}c</span>}
            </div>
          </div>
        );
      })}
    </>
  );
};

export const L06: React.FC = () => {
  const frame = useCurrentFrame();
  const i = lineAt(frame);
  const line = lines[i];
  const prevLine = lines[i - 1];
  const b = beats[line.id];
  const blend = ramp(frame, b.from, sec(0.5));
  const level = (name: string) => levelOf(prevLine, name) + (levelOf(line, name) - levelOf(prevLine, name)) * blend;
  const rankStep = rankStepAt(frame);
  const lineStep = lineStepAt(frame);

  const on = (k: keyof typeof SPANS) =>
    Math.max(0, ...SPANS[k].map((s) => ramp(frame, s.from - sec(0.3), sec(0.6)) * (1 - ramp(frame, s.until - sec(0.3), sec(0.6)))));
  const rankOn = on("rank");
  const linesOn = on("lines");
  const panels = { real: on("real"), parts: on("parts"), bill: on("bill") };
  const panelOn = Math.max(...Object.values(panels));
  const cardOpacity = line.card ? window(frame, b.from, b.until) : 0;
  const dim = (1 - 0.7 * cardOpacity) * (1 - 0.92 * panelOn);

  // A line that jumps the chart to another time shows its note once the chart has arrived.
  const stepAt = line.view === "lines" ? lineStepAt : rankStepAt;
  const moved = line.race.at !== undefined && prevLine && Math.abs(stepAt(b.from) - line.race.at) > 0.01;
  const noteOpacity = window(frame, b.from + (moved ? sec(1.3) : 0), b.until);
  const takes = lines.filter((l) => l.take).map((l) => ({ from: beats[l.id].from, title: l.take![0], body: l.take![1] }));
  const source = line.panel === "real" ? SOURCES.real : line.panel === "parts" ? SOURCES.parts : SOURCES.main;
  const timeOf = linesOn > 0.5 ? lineStep : rankStep;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 80, top: 40, color: C.paper, fontSize: 34, fontWeight: 800 }}>What Europe pays for electricity</div>
      <div style={{ position: "absolute", left: 80, top: 84, color: C.slate, fontSize: 24 }}>
        {linesOn > 0.5
          ? "Household price per kilowatt-hour, in euro cents, 2008–2026"
          : `Household price per kilowatt-hour, in euro cents, ${halfOf(timeOf) === "Jan–Jun" ? "first" : "second"} half of ${yearOf(timeOf)}`}
      </div>
      <div style={{ position: "absolute", right: 70, top: 36, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
        <Mark size={52} />
        <Wordmark size={34} />
      </div>

      {rankOn > 0 && (
        <div style={{ opacity: rankOn * dim }}>
          <Race data={rank} year={rankStep} level={level} {...CHART} format={cents} axisFormat={(v) => `${v}c`} scaleTop={42} />
          <Counter step={rankStep} style={{ right: 90, bottom: 80 }} />
        </div>
      )}
      {linesOn > 0 && (
        <div style={{ opacity: linesOn * dim }}>
          <LineRace
            data={priceLines}
            year={lineStep}
            hero={HERO}
            level={level}
            x={170}
            y={200}
            width={1290}
            height={670}
            yMin={0}
            yMax={70}
            yStep={10}
            xStep={4}
            format={cents}
            axisFormat={(v) => `${v}c`}
            timeLabel={(t) => String(yearOf(t))}
            markers={[{ year: 28, label: "gas price shock" }]}
          />
          <Counter step={lineStep} style={{ left: 200, top: 205 }} />
        </div>
      )}

      <div style={{ position: "absolute", left: 80, bottom: 34, color: C.slate, fontSize: 22 }}>{source}</div>
      {line.note &&
        (line.view === "lines" ? (
          <NoteBox text={line.note} opacity={noteOpacity} at={{ left: 175, top: 795, fontSize: 28, padding: "14px 24px", whiteSpace: "nowrap" }} />
        ) : (
          <NoteBox text={line.note.split(" · ").join("\n")} opacity={noteOpacity} at={{ right: 90, top: 470, width: 470, fontSize: 30, padding: "18px 26px", lineHeight: 1.3, boxSizing: "border-box", whiteSpace: "pre-line" }} />
        ))}
      {line.card && <InfoCard title={line.card[0]} body={line.card[1]} opacity={cardOpacity} />}

      {panels.real > 0 && (
        <Panel opacity={panels.real} title="The EU average, 2008 and 2025" subtitle="Average of the two half-years, in each whole year" footnote="Eurostat: household electricity prices (nrg_pc_204) and consumer prices (prc_hicp_midx).">
          <BigStat value="+76%" text={"In euros: from 16 cents a kilowatt-hour\nin 2008 to 29 cents in 2025"} style={{ left: 56, top: 220, opacity: ramp(frame, beats.real_a.from + sec(0.4), sec(0.8)), whiteSpace: "pre-line" }} size={150} />
          <BigStat
            value="+20%"
            colour={C.teal}
            text={"After inflation: prices in general\nrose by 47% over the same years"}
            style={{ left: 680, top: 220, opacity: ramp(frame, beats.real_b.from + sec(0.4), sec(0.8)), whiteSpace: "pre-line" }}
            size={150}
          />
        </Panel>
      )}
      {panels.parts > 0 && (
        <Panel opacity={panels.parts} title="What a kilowatt-hour cost in 2025" subtitle="Euro cents, split into the energy, the network and taxes" footnote="Eurostat (nrg_pc_204_c). Taxes include VAT, minus government credits.">
          <PartBars frame={frame} />
        </Panel>
      )}
      {panels.bill > 0 && (
        <Panel opacity={panels.bill} title="A year's electricity for one home" subtitle="3,500 kWh at each country's average price" footnote="An illustration only: real bills add standing charges and depend on the contract. Eurostat (nrg_pc_204).">
          <PanelBars
            rows={[
              { label: "Ireland", code: "IE", value: 1354.9, colour: C.teal, ghost: 619.2 },
              { label: "Germany", code: "DE", value: 1266.3, colour: C.teal, ghost: 751.8 },
              { label: "EU average", code: "EU", value: 991.2, colour: C.amber, ghost: 561.4 },
              { label: "Hungary", code: "HU", value: 398.7, colour: C.teal, ghost: 541.8 },
            ]}
            max={1500}
            width={640}
            labelWidth={330}
            top={170}
            grow={ramp(frame, beats.bill_a.from + sec(1), sec(1.2))}
            ghost={ramp(frame, beats.bill_c.from, sec(0.8))}
            ghostLabel="Early 2008"
            nowLabel="Early 2026"
            format={euros}
          />
        </Panel>
      )}

      <TitleCard frame={frame} from={beats.hook_c.from} until={beats.hook_c.until} title="Electricity Prices in Europe" years="2008–2026" tagline="Who pays the most?" />
      {frame >= beats.take_1.from - sec(0.6) && (
        <Takeaways frame={frame} takes={takes} nextFrom={beats.next.from} next={["Next: Europe's biggest populations, 1950–2100", "Then: Every European Cup winner, 1956–2026"]} />
      )}
      {frame >= beats.end.from - sec(0.4) && <EndScreen frame={frame} from={beats.end.from} sources="Sources in the description · The world, charted through time." />}

      {lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.5)}>
          <Html5Audio src={staticFile(`voice/l06/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={words.music.file} beats={beats} total={total} />
    </AbsoluteFill>
  );
};
