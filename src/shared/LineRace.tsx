import React from "react";
import { interpolateColors } from "remotion";
import { C, FONT } from "../brand";
import { Flag } from "./Flag";
import type { RaceData } from "./Race";

export type Marker = { year: number; label: string; row?: number };
/** Where the hero's line crosses another country's; `strength` (0–1) is how loudly to show it. */
export type Crossing = { country: string; year: number; strength: number };

/** A country's value at a fractional year, on a straight line between whole years. */
export function valueAt(data: RaceData, name: string, year: number) {
  const c = data.countries.find((k) => k.name === name)!;
  const first = data.years[0];
  const last = data.years[data.years.length - 1];
  const y = Math.min(Math.max(year, first), last);
  const i0 = Math.floor(y - first);
  const i1 = Math.min(i0 + 1, data.years.length - 1);
  const v0 = c.values[i0] as number;
  const v1 = c.values[i1] as number;
  return v0 + (v1 - v0) * (y - first - i0);
}

/** The exact moment the hero passes `other` in the year before `year`, and the value there. */
export function crossingPoint(data: RaceData, hero: string, other: string, year: number) {
  const d0 = valueAt(data, hero, year - 1) - valueAt(data, other, year - 1);
  const d1 = valueAt(data, hero, year) - valueAt(data, other, year);
  const t = d0 === d1 ? 1 : Math.min(1, Math.max(0, d0 / (d0 - d1)));
  const at = year - 1 + t;
  return { at, value: valueAt(data, hero, at) };
}

/**
 * Moves labels apart so none overlap. Each label wants to sit at `want` (its
 * centre); labels that would touch are grouped and the group is centred on
 * what its members want, so labels slide smoothly instead of jumping.
 */
export function spread(wants: number[], gap: number, min: number, max: number) {
  const order = wants.map((w, i) => ({ w, i })).sort((a, b) => a.w - b.w || a.i - b.i);
  let groups = order.map((o) => ({ members: [o], top: o.w }));
  for (let merged = true; merged; ) {
    merged = false;
    for (let g = 0; g < groups.length - 1; g++) {
      const a = groups[g];
      const b = groups[g + 1];
      if (a.top + a.members.length * gap > b.top) {
        const members = [...a.members, ...b.members];
        const top = members.reduce((s, m, k) => s + m.w - k * gap, 0) / members.length;
        groups = [...groups.slice(0, g), { members, top }, ...groups.slice(g + 2)];
        merged = true;
        break;
      }
    }
  }
  const out = wants.slice();
  let floor = min;
  for (const g of groups) {
    const top = Math.max(floor, Math.min(g.top, max - (g.members.length - 1) * gap));
    g.members.forEach((m, k) => (out[m.i] = top + k * gap));
    floor = top + g.members.length * gap;
  }
  return out;
}

/**
 * A line chart race: every country's line is drawn up to the current year,
 * with its flag, name and value at the end. The hero's line is amber;
 * `level` gives the others' emphasis (2 = in focus, 1 = normal, 0 = background).
 */
export const LineRace: React.FC<{
  data: RaceData;
  year: number;
  hero: string;
  level: (name: string) => number;
  x: number;
  y: number;
  width: number;
  height: number;
  yMin?: number;
  yMax: number;
  yStep: number;
  xStep?: number;
  fontSize?: number;
  flagSize?: number;
  /** Space between label centres. */
  labelGap?: number;
  /** Lowest a label may sit (defaults to the bottom of the plot). */
  labelFloor?: number;
  format: (v: number) => string;
  axisFormat: (v: number) => string;
  markers?: Marker[];
  crossings?: Crossing[];
  only?: string[];
  /** "always": each crossing keeps its year under the ring; "highlight": the year shows only while it is being talked about. */
  crossingLabels?: "always" | "highlight";
}> = ({
  data,
  year,
  hero,
  level,
  x,
  y,
  width,
  height,
  yMin = 0,
  yMax,
  yStep,
  xStep = 5,
  fontSize = 22,
  flagSize = 26,
  labelGap = 34,
  labelFloor,
  format,
  axisFormat,
  markers = [],
  crossings = [],
  only,
  crossingLabels = "always",
}) => {
  const first = data.years[0];
  const last = data.years[data.years.length - 1];
  const xOf = (yr: number) => x + ((yr - first) / (last - first)) * width;
  const yOf = (v: number) => y + height - ((v - yMin) / (yMax - yMin)) * height;
  const now = Math.min(Math.max(year, first), last);
  const countries = data.countries.filter((c) => !only || only.includes(c.name));
  // Background lines first, the hero last, so the lines in focus are drawn on top.
  const drawOrder = [...countries].sort((a, b) => (a.name === hero ? 1 : 0) - (b.name === hero ? 1 : 0) || level(a.name) - level(b.name));

  const heads = countries.map((c) => ({ c, v: valueAt(data, c.name, now) }));
  const labelY = spread(
    heads.map((h) => yOf(h.v)),
    labelGap,
    y - labelGap * 0.4,
    labelFloor ?? y + height,
  );

  const yTicks: number[] = [];
  for (let t = Math.ceil(yMin / yStep) * yStep; t <= yMax + 0.001; t += yStep) yTicks.push(t);
  const xTicks: number[] = [];
  for (let t = Math.ceil(first / xStep) * xStep; t <= last; t += xStep) xTicks.push(t);

  const pathOf = (name: string) => {
    const pts: string[] = [];
    for (let yr = first; yr <= Math.floor(now); yr++) pts.push(`${xOf(yr).toFixed(1)},${yOf(valueAt(data, name, yr)).toFixed(1)}`);
    if (now > Math.floor(now)) pts.push(`${xOf(now).toFixed(1)},${yOf(valueAt(data, name, now)).toFixed(1)}`);
    return `M${pts.join("L")}`;
  };

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        {yTicks.map((t) => (
          <line key={`g${t}`} x1={x} x2={x + width} y1={yOf(t)} y2={yOf(t)} stroke={C.line} strokeWidth={t === yMin ? 2 : 1} />
        ))}
        {markers.map((m) => {
          const o = Math.min(1, Math.max(0, (now - m.year + 0.3) / 0.3));
          return o > 0 ? (
            <line key={`m${m.year}`} x1={xOf(m.year)} x2={xOf(m.year)} y1={y} y2={y + height} stroke={C.slate} strokeOpacity={0.45 * o} strokeWidth={2} strokeDasharray="6 8" />
          ) : null;
        })}
        {drawOrder.map((c) => {
          const isHero = c.name === hero;
          const lv = level(c.name);
          const colour = isHero ? C.amber : interpolateColors(lv, [0, 1, 2], ["#2b4560", "#1b8f82", C.teal]);
          const w = isHero ? 6 : 2.5 + lv;
          return (
            <g key={c.code}>
              {isHero && <path d={pathOf(c.name)} fill="none" stroke={C.amber} strokeOpacity={0.22} strokeWidth={18} strokeLinejoin="round" strokeLinecap="round" />}
              <path d={pathOf(c.name)} fill="none" stroke={colour} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {heads.map((h, i) => {
          const isHero = h.c.name === hero;
          const lv = level(h.c.name);
          const colour = isHero ? C.amber : interpolateColors(lv, [0, 1, 2], ["#2b4560", "#1b8f82", C.teal]);
          const hx = xOf(now);
          const hy = yOf(h.v);
          return (
            <g key={`h${h.c.code}`}>
              {Math.abs(labelY[i] - hy) > 3 && <line x1={hx} y1={hy} x2={hx + 14} y2={labelY[i]} stroke={colour} strokeOpacity={0.6} strokeWidth={1.5} />}
              <circle cx={hx} cy={hy} r={isHero ? 9 : 4 + lv * 1.5} fill={colour} stroke={C.navyDeep} strokeWidth={2} />
            </g>
          );
        })}
        {crossings.map((k) => {
          const p = crossingPoint(data, hero, k.country, k.year);
          if (now < p.at) return null;
          const cx = xOf(p.at);
          const cy = yOf(p.value);
          return <circle key={`c${k.country}`} cx={cx} cy={cy} r={12 + 8 * k.strength} fill="none" stroke={C.amber} strokeOpacity={0.55 + 0.45 * k.strength} strokeWidth={3} />;
        })}
      </svg>

      {yTicks.map((t) => (
        <div key={`yl${t}`} style={{ position: "absolute", left: x - 14, transform: "translateX(-100%)", top: yOf(t) - fontSize * 0.6, color: C.slate, fontSize: fontSize * 0.85, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
          {axisFormat(t)}
        </div>
      ))}
      {xTicks.map((t) => (
        <div key={`xl${t}`} style={{ position: "absolute", left: xOf(t) - 50, width: 100, top: y + height + 10, textAlign: "center", color: C.slate, fontSize: fontSize * 0.85 }}>
          {t}
        </div>
      ))}
      {markers.map((m) => {
        const o = Math.min(1, Math.max(0, (now - m.year + 0.3) / 0.3));
        return o > 0 ? (
          <div key={`ml${m.year}`} style={{ position: "absolute", left: xOf(m.year) + 8, top: y + 4 + (m.row ?? 0) * (fontSize * 1.4), opacity: o, fontSize: fontSize * 0.85, whiteSpace: "nowrap" }}>
            <span style={{ color: C.amber, fontWeight: 800 }}>{m.year}</span>
            <span style={{ color: C.slate, fontWeight: 600 }}> {m.label}</span>
          </div>
        ) : null;
      })}
      {crossings.map((k) => {
        const p = crossingPoint(data, hero, k.country, k.year);
        if (now < p.at) return null;
        const cx = xOf(p.at);
        const cy = yOf(p.value);
        // Only the year sits under the ring: anything longer covers the lines and the earlier rings. Say the rest in a note.
        return (
          <div
            key={`cl${k.country}`}
            style={{
              position: "absolute",
              left: cx,
              top: cy + 20 + 8 * k.strength,
              // A little left of centre, so it never reaches the names that start just right of the line ends.
              transform: "translateX(calc(-50% - 18px))",
              color: C.amber,
              fontSize: fontSize * (0.9 + 0.3 * k.strength),
              fontWeight: 800,
              opacity: crossingLabels === "always" ? 0.85 + 0.15 * k.strength : k.strength,
              whiteSpace: "nowrap",
            }}
          >
            {k.year}
          </div>
        );
      })}
      {heads.map((h, i) => {
        const isHero = h.c.name === hero;
        const lv = isHero ? 2 : level(h.c.name);
        const text = isHero ? C.amber : interpolateColors(lv, [0, 1, 2], ["#4f647a", "#b9c6d2", C.paper]);
        return (
          <div
            key={`hl${h.c.code}`}
            style={{
              position: "absolute",
              left: xOf(now) + 16,
              top: labelY[i] - flagSize / 2,
              height: flagSize,
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              color: text,
              fontSize: isHero ? fontSize * 1.1 : fontSize,
              fontWeight: isHero ? 800 : 600,
              fontVariantNumeric: "tabular-nums",
              opacity: 0.45 + 0.55 * Math.min(1, lv),
            }}
          >
            <Flag code={h.c.code} size={flagSize} />
            <span>{h.c.name}</span>
            <span style={{ fontWeight: 800 }}>{format(h.v)}</span>
          </div>
        );
      })}
    </div>
  );
};
