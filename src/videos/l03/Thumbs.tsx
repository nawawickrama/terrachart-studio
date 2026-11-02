import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { spread } from "../../shared/LineRace";
import { Mark } from "../../shared/Logo";
import data from "./data.json";

const series = (name: string) => data.countries.find((c) => c.name === name)!;

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ background: `radial-gradient(900px 520px at 70% 50%, rgba(31,181,163,0.18), transparent 70%), linear-gradient(180deg, ${C.navy}, ${C.navyDeep})`, fontFamily: FONT }}
  >
    {children}
    <div style={{ position: "absolute", left: 36, bottom: 30 }}>
      <Mark size={70} />
    </div>
  </AbsoluteFill>
);

/** Thumbnail A: Poland's line climbing past Hungary, Greece and Portugal, and ×3.7. */
export const L03ThumbA: React.FC = () => {
  const box = { x: 610, y: 70, w: 470, h: 560 };
  const min = 10000;
  const max = 50000;
  const xOf = (i: number) => box.x + (i / (data.years.length - 1)) * box.w;
  const yOf = (v: number) => box.y + box.h - ((v - min) / (max - min)) * box.h;
  const path = (name: string) => series(name).values.map((v, i) => `${i ? "L" : "M"}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join("");
  const others = ["Greece", "Portugal", "Hungary"];
  const last = data.years.length - 1;
  return (
    <Frame>
      <div style={{ position: "absolute", left: 60, top: 40, color: C.paper, fontWeight: 900, fontSize: 96, letterSpacing: "-0.04em", lineHeight: 1 }}>POLAND</div>
      <div style={{ position: "absolute", left: 52, top: 150, color: C.amber, fontWeight: 900, fontSize: 230, letterSpacing: "-0.06em", lineHeight: 1 }}>×3.7</div>
      <div style={{ position: "absolute", left: 64, top: 400, width: 440, color: C.slate, fontWeight: 800, fontSize: 44, lineHeight: 1.15 }}>
        richer per person since 1990
      </div>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {others.map((o) => (
          <path key={o} d={path(o)} fill="none" stroke={C.teal} strokeOpacity={0.8} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        <path d={path("Poland")} fill="none" stroke={C.amber} strokeOpacity={0.25} strokeWidth={34} strokeLinejoin="round" strokeLinecap="round" />
        <path d={path("Poland")} fill="none" stroke={C.amber} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {spread(others.map((o) => yOf(series(o).values[last])), 68, 150, 680).map((y, k) => (
        <Flag key={others[k]} code={series(others[k]).code} size={62} style={{ position: "absolute", left: xOf(last) + 26, top: y - 31 }} />
      ))}
      <Flag code="PL" size={96} style={{ position: "absolute", left: xOf(last) + 70, top: yOf(series("Poland").values[last]) - 74 }} />
    </Frame>
  );
};

/** Thumbnail B: Poland now ahead of Portugal, Hungary and Greece. */
export const L03ThumbB: React.FC = () => {
  const names = ["Poland", "Portugal", "Hungary", "Greece"];
  const last = data.years.length - 1;
  const top = series("Poland").values[last];
  return (
    <Frame>
      <div style={{ position: "absolute", left: 60, top: 50, color: C.amber, fontWeight: 900, fontSize: 88, letterSpacing: "-0.04em", lineHeight: 1 }}>OVERTAKING</div>
      <div style={{ position: "absolute", left: 60, top: 150, color: C.paper, fontWeight: 900, fontSize: 88, letterSpacing: "-0.04em", lineHeight: 1 }}>EUROPE</div>
      <div style={{ position: "absolute", left: 64, top: 300, width: 470, color: C.slate, fontWeight: 800, fontSize: 42, lineHeight: 1.15 }}>
        Poland was the poorest of these in 1990
      </div>
      {names.map((name, i) => {
        const v = series(name).values[last];
        return (
          <div key={name} style={{ position: "absolute", left: 680, top: 90 + i * 135, display: "flex", alignItems: "center", gap: 16 }}>
            <Flag code={series(name).code} size={100} />
            <div style={{ width: (v / top) * 440, height: 96, borderRadius: "5px 48px 48px 5px", background: name === "Poland" ? C.amber : C.teal, opacity: name === "Poland" ? 1 : 0.85 }} />
          </div>
        );
      })}
    </Frame>
  );
};
