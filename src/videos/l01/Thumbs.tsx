import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark } from "../../shared/Logo";
import { money } from "../../shared/Race";
import data from "./data.json";

const last = data.years.length - 1;
const top8 = [...data.countries]
  .map((c) => ({ ...c, v: c.values[last] as number }))
  .sort((a, b) => b.v - a.v)
  .slice(0, 8);

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(900px 520px at 70% 50%, rgba(31,181,163,0.18), transparent 70%), linear-gradient(180deg, ${C.navy}, ${C.navyDeep})`, fontFamily: FONT }}>
    {children}
    <div style={{ position: "absolute", left: 36, bottom: 30 }}>
      <Mark size={70} />
    </div>
  </AbsoluteFill>
);

/** Thumbnail A: the 2025 finish of the race, with "1970 → 2025". */
export const L01ThumbA: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 50, top: 120, color: C.paper, fontWeight: 900, fontSize: 150, lineHeight: 0.95, letterSpacing: "-0.05em" }}>
      1970
      <div style={{ color: C.slate, fontSize: 90 }}>↓</div>
      <span style={{ color: C.amber }}>2025</span>
    </div>
    <div style={{ position: "absolute", left: 54, top: 44, color: C.paper, fontWeight: 800, fontSize: 46, letterSpacing: "0.03em" }}>EUROPE'S BIGGEST ECONOMIES</div>
    {top8.map((c, i) => {
      const w = (c.v / top8[0].v) * 560;
      return (
        <div key={c.code} style={{ position: "absolute", left: 480, top: 128 + i * 68, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: w, height: 54, borderRadius: "4px 27px 27px 4px", background: c.name === "Poland" ? C.amber : C.teal }} />
          <Flag code={c.code} size={56} />
        </div>
      );
    })}
  </Frame>
);

/** Thumbnail B: Poland and Switzerland, nine billion dollars apart. */
export const L01ThumbB: React.FC = () => {
  const ch = data.countries.find((c) => c.name === "Switzerland")!.values[last] as number;
  const pl = data.countries.find((c) => c.name === "Poland")!.values[last] as number;
  const Bar: React.FC<{ code: string; v: number; colour: string; top: number }> = ({ code, v, colour, top }) => (
    <div style={{ position: "absolute", left: 60, top, display: "flex", alignItems: "center", gap: 20 }}>
      <Flag code={code} size={120} />
      <div style={{ width: (v / ch) * 820, height: 110, borderRadius: "6px 55px 55px 6px", background: colour, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 34, color: C.navy, fontSize: 58, fontWeight: 900 }}>
        {money(v)}
      </div>
    </div>
  );
  return (
    <Frame>
      <div style={{ position: "absolute", left: 60, top: 50, color: C.amber, fontWeight: 900, fontSize: 120, letterSpacing: "-0.04em", lineHeight: 1 }}>
        $9 BILLION
      </div>
      <div style={{ position: "absolute", left: 64, top: 175, color: C.paper, fontWeight: 900, fontSize: 70, letterSpacing: "-0.02em" }}>APART</div>
      <Bar code="CH" v={ch} colour={C.teal} top={300} />
      <Bar code="PL" v={pl} colour={C.amber} top={450} />
    </Frame>
  );
};
