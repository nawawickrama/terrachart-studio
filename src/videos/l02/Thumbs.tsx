import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark } from "../../shared/Logo";
import rank from "./rank.json";

const value = (name: string, stage: 0 | 1) => rank.countries.find((c) => c.name === name)!.values[stage];
const code = (name: string) => rank.countries.find((c) => c.name === name)!.code;

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

/** Thumbnail A: the highest and lowest minimum wage in euros. */
export const L02ThumbA: React.FC = () => {
  const lu = value("Luxembourg", 0);
  const Bar: React.FC<{ name: string; colour: string; top: number }> = ({ name, colour, top }) => (
    <div style={{ position: "absolute", left: 60, top, display: "flex", alignItems: "center", gap: 20 }}>
      <Flag code={code(name)} size={120} />
      <div
        style={{
          width: Math.max(280, (value(name, 0) / lu) * 820),
          height: 110,
          borderRadius: "6px 55px 55px 6px",
          background: colour,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 30,
          color: C.navy,
          fontSize: 60,
          fontWeight: 900,
        }}
      >
        €{value(name, 0).toLocaleString("en-GB")}
      </div>
    </div>
  );
  return (
    <Frame>
      <div style={{ position: "absolute", left: 60, top: 46, color: C.paper, fontWeight: 900, fontSize: 92, letterSpacing: "-0.04em", lineHeight: 1 }}>
        MINIMUM WAGE
      </div>
      <div style={{ position: "absolute", left: 64, top: 150, color: C.amber, fontWeight: 900, fontSize: 64, letterSpacing: "-0.02em" }}>SAME EU, 4.5× APART</div>
      <Bar name="Luxembourg" colour={C.teal} top={290} />
      <Bar name="Bulgaria" colour={C.amber} top={440} />
    </Frame>
  );
};

/** Thumbnail B: the top five in buying power, Germany first. */
export const L02ThumbB: React.FC = () => {
  const top5 = [...rank.countries].sort((a, b) => b.values[1] - a.values[1]).slice(0, 5);
  return (
    <Frame>
      <div style={{ position: "absolute", left: 60, top: 50, color: C.amber, fontWeight: 900, fontSize: 104, letterSpacing: "-0.04em", lineHeight: 1 }}>REAL #1:</div>
      <div style={{ position: "absolute", left: 60, top: 160, color: C.paper, fontWeight: 900, fontSize: 104, letterSpacing: "-0.04em", lineHeight: 1 }}>GERMANY</div>
      <div style={{ position: "absolute", left: 64, top: 300, width: 520, color: C.slate, fontWeight: 800, fontSize: 44, lineHeight: 1.15 }}>
        EU minimum wages, counted in what they buy
      </div>
      {top5.map((c, i) => (
        <div key={c.code} style={{ position: "absolute", left: 640, top: 70 + i * 120, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: (c.values[1] / top5[0].values[1]) * 470, height: 86, borderRadius: "5px 43px 43px 5px", background: c.name === "Germany" ? C.amber : C.teal }} />
          <Flag code={c.code} size={88} />
        </div>
      ))}
    </Frame>
  );
};
