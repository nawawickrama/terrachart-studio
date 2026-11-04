import React from "react";
import { interpolateColors } from "remotion";
import { C, FONT } from "../brand";
import { Flag } from "./Flag";

export type Country = { name: string; code: string; values: (number | null)[] };
export type RaceData = { years: number[]; countries: Country[] };

/** Bar labels in whole billions ("$217 bn", "$1,044 bn"), so close rivals never round to the same number. */
export const money = (bn: number) => `$${Math.round(bn).toLocaleString("en-GB")} bn`;

/** Axis labels: "$500 bn", "$1 tn", "$1.5 tn". */
const axisMoney = (bn: number) => (bn >= 1000 ? `$${Number((bn / 1000).toFixed(2))} tn` : `$${bn} bn`);

const NICE_STEPS = [10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000];

type Row = { country: Country; value: number; rank: number; alpha: number };

/** Each country's value at a fractional year (straight line between whole years), and whether it has data yet. */
function valuesAt(data: RaceData, year: number) {
  const first = data.years[0];
  const last = data.years[data.years.length - 1];
  const y = Math.min(Math.max(year, first), last);
  const i0 = Math.floor(y - first);
  const i1 = Math.min(i0 + 1, data.years.length - 1);
  const f = y - first - i0;
  return data.countries.map((c) => {
    const v0 = c.values[i0];
    const v1 = c.values[i1];
    if (v0 == null && v1 == null) return null;
    // A country whose data starts next year grows in from zero, so it never takes a place before it exists.
    if (v0 == null) return { value: (v1 as number) * f, alpha: Math.min(1, f * 2) };
    const value = v1 == null ? v0 : v0 + (v1 - v0) * f;
    return { value, alpha: 1 };
  });
}

/** Places by value at one moment: 0 is the biggest. Ties keep the data's order; countries without data sit below the chart. */
function placesAt(data: RaceData, year: number) {
  const vals = valuesAt(data, year);
  const order = vals
    .map((v, i) => ({ v, i }))
    .filter((x) => x.v !== null)
    .sort((a, b) => (b.v as { value: number }).value - (a.v as { value: number }).value || a.i - b.i);
  const places = vals.map(() => data.countries.length);
  order.forEach((x, rank) => (places[x.i] = rank));
  return places;
}

/**
 * Each country's value and place. Places follow the values exactly, so two
 * bars change places at the moment one passes the other. Passing `trail`
 * (the years shown over the last few frames, oldest first) averages the
 * places over them, so a swap slides over a quarter of a second instead of
 * jumping. With `only`, places are counted among just those countries.
 */
export function rowsAt(full: RaceData, year: number, only?: string[], trail?: number[]): Row[] {
  const data = only ? { ...full, countries: full.countries.filter((c) => only.includes(c.name)) } : full;
  const vals = valuesAt(data, year);
  const history = trail && trail.length ? trail : [year];
  const sums = data.countries.map(() => 0);
  for (const y of history) placesAt(data, y).forEach((p, i) => (sums[i] += p));
  return data.countries
    .map((country, i) => {
      const v = vals[i];
      return v ? { country, value: v.value, rank: sums[i] / history.length, alpha: v.alpha } : null;
    })
    .filter((r): r is Row => r !== null);
}

/**
 * A horizontal bar chart race. `level` gives each country's emphasis:
 * 2 = the subject (amber), 1 = normal (teal), 0 = in the background.
 */
export const Race: React.FC<{
  data: RaceData;
  year: number;
  trail?: number[];
  level: (name: string) => number;
  x: number;
  y: number;
  width: number;
  height: number;
  labelWidth?: number;
  fontSize?: number;
  axis?: boolean;
  format?: (v: number) => string;
  axisFormat?: (v: number) => string;
  /** Fixed top of the scale; by default it follows the biggest bar. */
  scaleTop?: number;
  /** 0–1: how strongly the bars are hatched, for years that are projections rather than measurements. */
  striped?: number;
}> = ({ data, year, trail, level, x, y, width, height, labelWidth = 290, fontSize = 26, axis = true, format = money, axisFormat = axisMoney, scaleTop, striped = 0 }) => {
  const rows = rowsAt(data, year, undefined, trail);
  const slots = data.countries.length;
  const pitch = height / slots;
  const barH = pitch * 0.72;
  const flag = barH * 0.92;
  const barLeft = x + labelWidth + 18;
  const maxBar = width - labelWidth - 18 - flag - 190;
  const top = Math.max(...rows.map((r) => r.value));
  const scaleMax = scaleTop ?? top * 1.04;
  const step = NICE_STEPS.find((s) => scaleMax / s <= 5.5) ?? 2000;
  const ticks = Array.from({ length: Math.floor(scaleMax / step) }, (_, i) => (i + 1) * step);
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
      {axis &&
        ticks.map((t) => {
          const left = barLeft + (t / scaleMax) * maxBar;
          return (
            <div key={t}>
              <div style={{ position: "absolute", left, top: y - 14, width: 1, height: height + 14, background: C.line }} />
              <div
                style={{ position: "absolute", left: left - 80, width: 160, top: y - 46, textAlign: "center", color: C.slate, fontSize: fontSize * 0.7 }}
              >
                {axisFormat(t)}
              </div>
            </div>
          );
        })}
      {rows.map(({ country, value, rank, alpha }) => {
        const lv = level(country.name);
        const colour = interpolateColors(lv, [0, 1, 2], ["#24394f", C.teal, C.amber]);
        const textColour = interpolateColors(lv, [0, 1, 2], ["#5d7187", C.paper, C.amber]);
        const w = Math.max(barH, (value / scaleMax) * maxBar);
        const rowTop = y + rank * pitch + (pitch - barH) / 2;
        return (
          <div key={country.code} style={{ opacity: alpha * (rank > slots - 0.5 ? 0 : 1) }}>
            <div
              style={{
                position: "absolute",
                left: x,
                width: labelWidth,
                top: rowTop,
                height: barH,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                color: textColour,
                fontSize,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {country.name}
            </div>
            <div
              style={{
                position: "absolute",
                left: barLeft,
                top: rowTop,
                width: w,
                height: barH,
                background: striped > 0 ? `repeating-linear-gradient(135deg, ${colour} 0 9px, rgba(8,19,31,${0.55 * striped}) 9px 14px)` : colour,
                borderRadius: `4px ${barH / 2}px ${barH / 2}px 4px`,
              }}
            />
            <Flag code={country.code} size={flag} style={{ position: "absolute", left: barLeft + w + 10, top: rowTop + (barH - flag) / 2 }} />
            <div
              style={{
                position: "absolute",
                left: barLeft + w + flag + 22,
                top: rowTop,
                height: barH,
                display: "flex",
                alignItems: "center",
                color: textColour,
                fontSize: fontSize * 0.95,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {format(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
