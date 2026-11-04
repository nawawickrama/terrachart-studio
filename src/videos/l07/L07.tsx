import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { LineRace } from "../../shared/LineRace";
import { Mark, Wordmark } from "../../shared/Logo";
import { MusicBed } from "../../shared/MusicBed";
import { EndScreen, InfoCard, NoteBox, Takeaways, TitleCard } from "../../shared/Overlays";
import { Panel, PanelBars } from "../../shared/Panels";
import { Race, type RaceData } from "../../shared/Race";
import { ramp, sec, window } from "../../shared/motion";
import linesData from "./lines.json";
import rankData from "./rank.json";
import { LAST_ESTIMATE, beats, lineAt, lineYearAt, lines, rankYearAt, total, type Line } from "./timeline";
import words from "./words.json";

const rank = rankData as RaceData;
const popLines = linesData as RaceData;
const HERO = "United Kingdom";
const levelOf = (l: Line | undefined, name: string) => (!l?.focus?.length ? 1 : l.focus.includes(name) ? 2 : 0);
const millions = (v: number) => `${v < 20 ? v.toFixed(1) : Math.round(v)}m`;

const CHART = { x: 80, y: 175, width: 1260, height: 780, labelWidth: 220, fontSize: 21 };
const LINE = { x: 170, y: 200, width: 1290, height: 670, first: 1950, last: 2100 };
const SOURCES = {
  main: "Source: UN World Population Prospects (2024) via Our World in Data. Estimates to 2023, then the UN's medium projection",
  births: "Source: UN World Population Prospects (2024) via Our World in Data",
  migration: "Source: UN DESA International Migrant Stock (2024) via Our World in Data",
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
  births: spans((l) => l.panel === "births"),
  natural: spans((l) => l.panel === "natural"),
  migration: spans((l) => l.panel === "migration"),
  age: spans((l) => l.panel === "age"),
};

/** Births minus deaths per 1,000 people in 2023 (UN WPP 2024 natural change rate × 10). */
const NATURAL = [
  { label: "United Kingdom", code: "GB", value: 0.5 },
  { label: "France", code: "FR", value: 0.3 },
  { label: "Spain", code: "ES", value: -2.3 },
  { label: "Germany", code: "DE", value: -3.7 },
  { label: "Italy", code: "IT", value: -4.7 },
  { label: "Ukraine", code: "UA", value: -7.5 },
];

/** Bars either side of zero, for numbers that can be negative. */
const DivergingBars: React.FC<{ grow: number }> = ({ grow }) => {
  const zero = 56 + 330 + 420;
  const scale = 52;
  return (
    <>
      <div style={{ position: "absolute", left: zero, top: 185, width: 3, height: 440, background: C.slate, opacity: 0.6 }} />
      <div style={{ position: "absolute", left: zero - 300, top: 158, width: 290, textAlign: "right", color: C.slate, fontSize: 22, fontWeight: 700 }}>More deaths than births</div>
      <div style={{ position: "absolute", left: zero + 14, top: 158, color: C.slate, fontSize: 22, fontWeight: 700 }}>More births</div>
      {NATURAL.map((r, i) => {
        const y = 195 + i * 74;
        const w = Math.max(6, Math.abs(r.value) * scale * grow);
        const neg = r.value < 0;
        return (
          <div key={r.label}>
            <div style={{ position: "absolute", left: 56, top: y, width: 330, height: 56, display: "flex", alignItems: "center", gap: 14, color: C.paper, fontSize: 28, fontWeight: 700 }}>
              <Flag code={r.code} size={40} />
              <span>{r.label}</span>
            </div>
            <div style={{ position: "absolute", left: neg ? zero - w : zero + 3, top: y + 4, width: w, height: 48, borderRadius: neg ? "24px 4px 4px 24px" : "4px 24px 24px 4px", background: neg ? C.amber : C.teal }} />
            <div
              style={{
                position: "absolute",
                left: neg ? zero - w - 16 : zero + w + 18,
                transform: neg ? "translateX(-100%)" : undefined,
                top: y,
                height: 56,
                display: "flex",
                alignItems: "center",
                color: C.paper,
                fontSize: 30,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                opacity: grow,
              }}
            >
              {r.value > 0 ? "+" : "−"}
              {Math.abs(r.value).toFixed(1)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export const L07: React.FC = () => {
  const frame = useCurrentFrame();
  const i = lineAt(frame);
  const line = lines[i];
  const prevLine = lines[i - 1];
  const b = beats[line.id];
  const blend = ramp(frame, b.from, sec(0.5));
  const level = (name: string) => levelOf(prevLine, name) + (levelOf(line, name) - levelOf(prevLine, name)) * blend;
  const rankYear = rankYearAt(frame);
  const lineYear = lineYearAt(frame);

  const on = (k: keyof typeof SPANS) =>
    Math.max(0, ...SPANS[k].map((s) => ramp(frame, s.from - sec(0.3), sec(0.6)) * (1 - ramp(frame, s.until - sec(0.3), sec(0.6)))));
  const rankOn = on("rank");
  const linesOn = on("lines");
  const panels = { births: on("births"), natural: on("natural"), migration: on("migration"), age: on("age") };
  const panelOn = Math.max(...Object.values(panels));
  const cardOpacity = line.card ? window(frame, b.from, b.until) : 0;
  const dim = (1 - 0.7 * cardOpacity) * (1 - 0.92 * panelOn);

  // A line that jumps the chart to another year shows its note once the chart has arrived.
  const yearOf = line.view === "lines" ? lineYearAt : rankYearAt;
  const moved = line.race.at !== undefined && prevLine && Math.abs(yearOf(b.from) - line.race.at) > 0.01;
  const noteOpacity = window(frame, b.from + (moved ? sec(1.3) : 0), b.until);
  const takes = lines.filter((l) => l.take).map((l) => ({ from: beats[l.id].from, title: l.take![0], body: l.take![1] }));
  const source = panels.migration > 0.5 ? SOURCES.migration : panelOn > 0.5 ? SOURCES.births : SOURCES.main;

  const shownYear = linesOn > 0.5 ? lineYear : rankYear;
  // Hatching fades in over the year the estimates end.
  const projected = Math.min(1, Math.max(0, rankYear - LAST_ESTIMATE));
  const crossing = window(frame, beats.cross.from, beats.cross.until, sec(0.5));
  const xOf = (yr: number) => LINE.x + ((yr - LINE.first) / (LINE.last - LINE.first)) * LINE.width;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 80, top: 40, color: C.paper, fontSize: 34, fontWeight: 800 }}>Europe's biggest populations</div>
      <div style={{ position: "absolute", left: 80, top: 84, color: C.slate, fontSize: 24 }}>
        {linesOn > 0.5
          ? "Population in millions, 1950–2100. Shaded years are the UN's projection"
          : shownYear > LAST_ESTIMATE + 0.5
            ? `Population in millions, ${Math.floor(shownYear + 0.001)}: UN projection`
            : `Population in millions, ${Math.floor(shownYear + 0.001)}`}
      </div>
      <div style={{ position: "absolute", right: 70, top: 36, display: "flex", alignItems: "center", gap: 10, opacity: 0.85 }}>
        <Mark size={52} />
        <Wordmark size={34} />
      </div>

      {rankOn > 0 && (
        <div style={{ opacity: rankOn * dim }}>
          <Race data={rank} year={rankYear} level={level} {...CHART} format={millions} axisFormat={(v) => `${v}m`} scaleTop={155} striped={projected} />
          <div style={{ position: "absolute", right: 90, bottom: 80, textAlign: "right", color: C.paper, opacity: 0.85, fontFamily: FONT }}>
            <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{Math.floor(rankYear + 0.001)}</div>
            <div style={{ marginTop: 6, color: C.amber, fontSize: 32, fontWeight: 800, letterSpacing: "0.08em", opacity: projected }}>UN PROJECTION</div>
          </div>
        </div>
      )}
      {linesOn > 0 && (
        <div style={{ opacity: linesOn * dim }}>
          <div
            style={{
              position: "absolute",
              left: xOf(LAST_ESTIMATE),
              top: LINE.y,
              width: LINE.x + LINE.width - xOf(LAST_ESTIMATE),
              height: LINE.height,
              background: "repeating-linear-gradient(135deg, rgba(141,162,184,0.08) 0 10px, transparent 10px 20px)",
            }}
          />
          <LineRace
            data={popLines}
            year={lineYear}
            hero={HERO}
            level={level}
            x={LINE.x}
            y={LINE.y}
            width={LINE.width}
            height={LINE.height}
            yMin={0}
            yMax={100}
            yStep={10}
            xStep={25}
            format={millions}
            axisFormat={(v) => `${v}m`}
            markers={[{ year: LAST_ESTIMATE, label: "UN projection from here", row: 0 }]}
            crossings={[{ country: "Germany", year: 2059, strength: crossing }]}
          />
          <div style={{ position: "absolute", left: 200, top: 740, color: C.paper, opacity: 0.85, fontSize: 130, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {Math.floor(lineYear + 0.001)}
          </div>
        </div>
      )}

      <div style={{ position: "absolute", left: 80, bottom: 34, color: C.slate, fontSize: 22 }}>{source}</div>
      {line.note &&
        (line.view === "lines" ? (
          <NoteBox text={line.note} opacity={noteOpacity} at={{ left: 560, top: 795, fontSize: 28, padding: "14px 24px", whiteSpace: "nowrap" }} />
        ) : (
          <NoteBox
            text={line.note.split(" · ").join("\n")}
            opacity={noteOpacity}
            at={{ right: 90, top: 400, width: 470, fontSize: 30, padding: "18px 26px", lineHeight: 1.3, boxSizing: "border-box", whiteSpace: "pre-line" }}
          />
        ))}
      {line.card && <InfoCard title={line.card[0]} body={line.card[1]} opacity={cardOpacity} />}

      {panels.births > 0 && (
        <Panel opacity={panels.births} title="Children per woman, 2023" subtitle="About 2.1 keeps a population steady without migration" footnote="UN World Population Prospects (2024) via Our World in Data.">
          <PanelBars
            rows={[
              { label: "France", code: "FR", value: 1.64, colour: C.teal },
              { label: "United Kingdom", code: "GB", value: 1.56, colour: C.teal },
              { label: "Germany", code: "DE", value: 1.44, colour: C.teal },
              { label: "Poland", code: "PL", value: 1.3, colour: C.teal },
              { label: "Italy", code: "IT", value: 1.2, colour: C.amber },
              { label: "Ukraine", code: "UA", value: 0.98, colour: C.amber },
            ]}
            max={2.4}
            width={640}
            labelWidth={330}
            top={190}
            pitch={74}
            reference={{ value: 2.1, label: "2.1" }}
            grow={ramp(frame, beats.births_a.from + sec(1), sec(1.2))}
            format={(v) => v.toFixed(2)}
          />
        </Panel>
      )}
      {panels.natural > 0 && (
        <Panel opacity={panels.natural} title="Births minus deaths, 2023" subtitle="For every 1,000 people, before migration" footnote="UN World Population Prospects (2024) via Our World in Data. Natural change rate.">
          <DivergingBars grow={ramp(frame, beats.natural_a.from + sec(0.6), sec(1.2))} />
        </Panel>
      )}
      {panels.migration > 0 && (
        <Panel opacity={panels.migration} title="Born in another country, 2024" subtitle="Share of everyone living in the country" footnote="UN DESA International Migrant Stock (2024) via Our World in Data.">
          <PanelBars
            rows={[
              { label: "Germany", code: "DE", value: 19.8, colour: C.amber },
              { label: "Spain", code: "ES", value: 18.5, colour: C.teal },
              { label: "United Kingdom", code: "GB", value: 17.1, colour: C.teal },
              { label: "Poland", code: "PL", value: 4.5, colour: C.teal },
            ]}
            max={24}
            width={640}
            labelWidth={330}
            top={190}
            grow={ramp(frame, beats.migration_a.from + sec(0.6), sec(1.2))}
            format={(v) => `${v.toFixed(1)}%`}
          />
        </Panel>
      )}
      {panels.age > 0 && (
        <Panel opacity={panels.age} title="Median age, 2025" subtitle="Half the people are older, half younger" footnote="UN World Population Prospects (2024) via Our World in Data. 2025 is a UN projection.">
          <PanelBars
            rows={[
              { label: "Italy", code: "IT", value: 48.2, colour: C.amber, ghost: 27.5 },
              { label: "Germany", code: "DE", value: 45.5, colour: C.teal, ghost: 32.9 },
              { label: "Poland", code: "PL", value: 42.5, colour: C.teal, ghost: 24.8 },
              { label: "United Kingdom", code: "GB", value: 40.1, colour: C.teal, ghost: 33.9 },
            ]}
            max={55}
            width={640}
            labelWidth={330}
            top={170}
            grow={ramp(frame, beats.age_a.from + sec(0.6), sec(1.2))}
            ghost={ramp(frame, beats.age_a.from + sec(4), sec(0.8))}
            ghostLabel="1950"
            nowLabel="2025"
            format={(v) => v.toFixed(1)}
          />
        </Panel>
      )}

      <TitleCard frame={frame} from={beats.hook_c.from} until={beats.hook_c.until} title="Europe's Biggest Populations" years="1950–2100" tagline="UN estimates and projections" />
      {frame >= beats.take_1.from - sec(0.6) && (
        <Takeaways frame={frame} takes={takes} nextFrom={beats.next.from} next={["Next: Every European Cup winner, 1956–2026", "Then: Who shops online the most in Europe?"]} />
      )}
      {frame >= beats.end.from - sec(0.4) && <EndScreen frame={frame} from={beats.end.from} sources="Sources in the description · The world, charted through time." />}

      {lines.map((l) => (
        <Sequence key={l.id} from={beats[l.id].from} durationInFrames={beats[l.id].frames + sec(0.5)}>
          <Html5Audio src={staticFile(`voice/l07/${l.id}.wav`)} />
        </Sequence>
      ))}
      <MusicBed src={words.music.file} beats={beats} total={total} />
    </AbsoluteFill>
  );
};
