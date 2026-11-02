import React from "react";
import { C, FONT } from "../brand";
import { Flag } from "./Flag";

/** A large panel in the middle of a wide frame, over a dimmed chart. */
export const Panel: React.FC<{ opacity: number; title: string; subtitle: string; footnote: string; children: React.ReactNode }> = ({
  opacity,
  title,
  subtitle,
  footnote,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 300,
      top: 170,
      width: 1320,
      height: 700,
      padding: "44px 56px",
      boxSizing: "border-box",
      background: C.panel,
      border: "1px solid rgba(244, 241, 234, 0.12)",
      borderRadius: 20,
      boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
      opacity,
      transform: `translateY(${(1 - opacity) * 24}px)`,
      fontFamily: FONT,
    }}
  >
    <div style={{ color: C.paper, fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</div>
    <div style={{ marginTop: 8, color: C.slate, fontSize: 26 }}>{subtitle}</div>
    {children}
    <div style={{ position: "absolute", left: 56, bottom: 30, color: C.slate, fontSize: 20 }}>{footnote}</div>
  </div>
);

export type BarRow = { label: string; code?: string; value: number; colour: string; ghost?: number };

/**
 * Horizontal bars inside a panel. `grow` (0–1) draws them in; `ghost` (0–1)
 * shows each row's earlier value as a thin bar underneath; `reference` draws
 * a dashed line such as an average.
 */
export const PanelBars: React.FC<{
  rows: BarRow[];
  max: number;
  grow: number;
  format: (v: number) => string;
  top?: number;
  width?: number;
  labelWidth?: number;
  ghost?: number;
  ghostLabel?: string;
  nowLabel?: string;
  reference?: { value: number; label: string };
}> = ({ rows, max, grow, format, top = 190, width = 760, labelWidth = 330, ghost = 0, ghostLabel, nowLabel, reference }) => {
  const pitch = rows.length > 2 ? 120 : 150;
  const left = 56 + labelWidth;
  return (
    <>
      {reference && (
        <>
          <div style={{ position: "absolute", left: left + (reference.value / max) * width, top: top - 30, width: 0, height: rows.length * pitch + 20, borderLeft: `3px dashed ${C.slate}`, opacity: 0.7 }} />
          <div style={{ position: "absolute", left: left + (reference.value / max) * width + 10, top: top - 34, color: C.slate, fontSize: 22, fontWeight: 700 }}>{reference.label}</div>
        </>
      )}
      {rows.map((r, i) => {
        const y = top + i * pitch;
        const w = Math.max(8, (r.value / max) * width * grow);
        return (
          <div key={r.label}>
            <div style={{ position: "absolute", left: 56, top: y, width: labelWidth - 20, height: 64, display: "flex", alignItems: "center", gap: 14, color: C.paper, fontSize: 30, fontWeight: 700 }}>
              {r.code && <Flag code={r.code} size={44} />}
              <span>{r.label}</span>
            </div>
            <div style={{ position: "absolute", left, top: y, width: w, height: 64, borderRadius: "4px 32px 32px 4px", background: r.colour }} />
            <div style={{ position: "absolute", left: left + w + 16, top: y, height: 64, display: "flex", alignItems: "center", color: C.paper, fontSize: 34, fontWeight: 800, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {format(r.value * grow)}
            </div>
            {r.ghost !== undefined && ghost > 0 && (
              <>
                <div style={{ position: "absolute", left, top: y + 72, width: (r.ghost / max) * width, height: 18, borderRadius: "3px 9px 9px 3px", background: C.slate, opacity: 0.55 * ghost }} />
                <div style={{ position: "absolute", left: left + (r.ghost / max) * width + 12, top: y + 66, color: C.slate, fontSize: 24, fontWeight: 700, opacity: ghost, fontVariantNumeric: "tabular-nums" }}>
                  {format(r.ghost)}
                </div>
              </>
            )}
          </div>
        );
      })}
      {ghostLabel && (
        <div style={{ position: "absolute", right: 56, top: 60, display: "flex", gap: 26, alignItems: "center", fontSize: 24, fontWeight: 700, color: C.slate }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 16, borderRadius: 8, background: C.teal }} />
            {nowLabel}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, opacity: ghost }}>
            <span style={{ width: 34, height: 10, borderRadius: 5, background: C.slate, opacity: 0.55 }} />
            {ghostLabel}
          </span>
        </div>
      )}
    </>
  );
};

/** A big figure with a short explanation, for the right-hand side of a panel or a frame. */
export const BigStat: React.FC<{ value: string; text: string; colour?: string; size?: number; style?: React.CSSProperties }> = ({ value, text, colour = C.amber, size = 96, style }) => (
  <div style={{ position: "absolute", fontFamily: FONT, ...style }}>
    <div style={{ color: colour, fontSize: size, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</div>
    <div style={{ marginTop: 12, color: C.paper, fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>{text}</div>
  </div>
);

/**
 * A simple line over time inside a panel: a solid part (what happened) and a
 * dashed part (a projection), drawn in from left to right by `draw` (0–1),
 * with labelled points.
 */
export const PanelTrend: React.FC<{
  years: number[];
  solid: (number | null)[];
  dashed: (number | null)[];
  yMax: number;
  yStep: number;
  draw: number;
  points: { year: number; value: number; label: string; below?: boolean }[];
  unit: (v: number) => string;
}> = ({ years, solid, dashed, yMax, yStep, draw, points, unit }) => {
  const X = 150;
  const Y = 170;
  const W = 1040;
  const H = 380;
  const first = years[0];
  const last = years[years.length - 1];
  const until = first + (last - first) * draw;
  const xOf = (yr: number) => X + ((yr - first) / (last - first)) * W;
  const yOf = (v: number) => Y + H - (v / yMax) * H;
  const path = (vals: (number | null)[]) =>
    years
      .map((yr, i) => ({ yr, v: vals[i] }))
      .filter((p) => p.v !== null && p.yr <= until)
      .map((p, i) => `${i ? "L" : "M"}${xOf(p.yr).toFixed(1)},${yOf(p.v as number).toFixed(1)}`)
      .join("");
  const ticks: number[] = [];
  for (let t = 0; t <= yMax; t += yStep) ticks.push(t);
  const decades = years.filter((yr) => yr % 10 === 0 && (yr - first) % 20 === 10);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        {ticks.map((t) => (
          <line key={t} x1={X} x2={X + W} y1={yOf(t)} y2={yOf(t)} stroke={C.line} strokeWidth={t ? 1 : 2} />
        ))}
        <path d={path(solid)} fill="none" stroke={C.teal} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
        <path d={path(dashed)} fill="none" stroke={C.amber} strokeWidth={6} strokeDasharray="14 12" strokeLinejoin="round" />
        {points
          .filter((p) => p.year <= until)
          .map((p) => (
            <circle key={p.year} cx={xOf(p.year)} cy={yOf(p.value)} r={9} fill={C.paper} stroke={C.panel} strokeWidth={3} />
          ))}
      </svg>
      {ticks.map((t) => (
        <div key={`t${t}`} style={{ position: "absolute", right: 1320 - X + 12, top: yOf(t) - 14, color: C.slate, fontSize: 22, whiteSpace: "nowrap" }}>
          {unit(t)}
        </div>
      ))}
      {decades.map((yr) => (
        <div key={`d${yr}`} style={{ position: "absolute", left: xOf(yr) - 40, width: 80, top: Y + H + 12, textAlign: "center", color: C.slate, fontSize: 22 }}>
          {yr}
        </div>
      ))}
      {points
        .filter((p) => p.year <= until)
        .map((p) => (
          <div
            key={`p${p.year}`}
            style={{ position: "absolute", left: xOf(p.year) - 110, width: 220, top: yOf(p.value) + (p.below ? 18 : -62), textAlign: "center", color: C.paper, fontSize: 28, fontWeight: 800, whiteSpace: "nowrap" }}
          >
            {p.label}
          </div>
        ))}
    </>
  );
};
