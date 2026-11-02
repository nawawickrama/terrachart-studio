import React from "react";
import { interpolateColors } from "remotion";
import { C, FONT } from "../brand";

export type Tile = { name: string; code: string; col: number; row: number; values: number[] };

/** Life-expectancy colours: dark and muted for short lives, bright teal for long ones. */
export const TILE_STOPS = [45, 55, 65, 72, 78, 84];
export const TILE_COLOURS = ["#2b2440", "#3b3f63", "#3a6b80", "#2a9a8f", "#1fc4ad", "#a5f5e6"];
const colourOf = (v: number) => interpolateColors(Math.min(Math.max(v, TILE_STOPS[0]), TILE_STOPS[TILE_STOPS.length - 1]), TILE_STOPS, TILE_COLOURS);

/** A value at a fractional year, on a straight line between whole years. */
export function tileValue(years: number[], values: number[], year: number) {
  const y = Math.min(Math.max(year, years[0]), years[years.length - 1]);
  const i0 = Math.floor(y - years[0]);
  const i1 = Math.min(i0 + 1, years.length - 1);
  return values[i0] + (values[i1] - values[i0]) * (y - years[0] - i0);
}

/**
 * A tile map: one square per country, laid out roughly where it sits on the
 * map, coloured by its value in the current year. `level` gives each country's
 * emphasis: 2 = in focus (amber outline), 1 = normal, 0 = in the background.
 */
export const TileMap: React.FC<{
  tiles: Tile[];
  years: number[];
  year: number;
  level: (name: string) => number;
  x: number;
  y: number;
  pitch: number;
  size: number;
  /** Small tiles (a thumbnail) show only the country code. */
  showValues?: boolean;
}> = ({ tiles, years, year, level, x, y, pitch, size, showValues = true }) => (
  // zIndex 0 keeps the raised tiles' stacking inside the map, so cards and end screens drawn later stay on top.
  <div style={{ position: "absolute", inset: 0, zIndex: 0, fontFamily: FONT }}>
    {tiles.map((t) => {
      const v = tileValue(years, t.values, year);
      const lv = level(t.name);
      const focus = Math.max(0, lv - 1);
      const bright = v > 77;
      return (
        <div
          key={t.code}
          style={{
            position: "absolute",
            left: x + t.col * pitch,
            top: y + t.row * pitch,
            width: size,
            height: size,
            borderRadius: 14,
            background: colourOf(v),
            opacity: 0.3 + 0.7 * Math.min(1, lv),
            boxShadow: focus > 0 ? `0 0 0 ${4 * focus}px ${C.amber}, 0 10px 30px rgba(0,0,0,${0.4 * focus})` : "none",
            transform: `scale(${1 + 0.06 * focus})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: bright ? C.navyDeep : C.paper,
            zIndex: focus > 0 ? 2 : 1,
          }}
        >
          <div style={{ fontSize: size * 0.3, fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1 }}>{t.code}</div>
          {showValues && <div style={{ marginTop: 6, fontSize: size * 0.25, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{v.toFixed(1)}</div>}
        </div>
      );
    })}
  </div>
);

/** A vertical colour key for the tile map. */
export const TileLegend: React.FC<{ x: number; y: number; height: number; label: string }> = ({ x, y, height, label }) => {
  const lo = TILE_STOPS[0];
  const hi = TILE_STOPS[TILE_STOPS.length - 1];
  const stops = TILE_STOPS.map((s, i) => `${TILE_COLOURS[i]} ${(((hi - s) / (hi - lo)) * 100).toFixed(1)}%`).reverse();
  const ticks = [45, 55, 65, 75, 84];
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT }}>
      <div style={{ color: C.slate, fontSize: 22, fontWeight: 700, marginBottom: 14, width: 260 }}>{label}</div>
      <div style={{ position: "relative", width: 26, height, borderRadius: 13, background: `linear-gradient(180deg, ${stops.join(", ")})` }}>
        {ticks.map((t) => (
          <div key={t} style={{ position: "absolute", left: 40, top: ((hi - t) / (hi - lo)) * height - 13, color: C.paper, fontSize: 22, fontWeight: 600, whiteSpace: "nowrap" }}>
            {t} years
          </div>
        ))}
      </div>
    </div>
  );
};
