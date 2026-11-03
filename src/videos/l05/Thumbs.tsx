import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark } from "../../shared/Logo";
import rankData from "./rank.json";

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

/** Thumbnail A: the bottom of the 2023 ranking, Germany last. */
export const L05ThumbA: React.FC = () => {
  const rows = rankData.countries.slice(-6);
  return (
    <Frame>
      <div style={{ position: "absolute", left: 60, top: 60, color: C.paper, fontWeight: 900, fontSize: 100, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
        GERMANY:
        <br />
        <span style={{ color: C.amber }}>LAST</span>
      </div>
      <div style={{ position: "absolute", left: 64, top: 320, width: 470, color: C.slate, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>
        Fewest hours worked in Europe
      </div>
      {rows.map((r, i) => {
        const hero = r.name === "Germany";
        return (
          <div key={r.name} style={{ position: "absolute", left: 700, top: 90 + i * 92, display: "flex", alignItems: "center", gap: 16 }}>
            <Flag code={r.code} size={hero ? 70 : 56} />
            <div style={{ width: (r.values[0] - 1000) * 1.0, height: hero ? 70 : 56, borderRadius: "4px 30px 30px 4px", background: hero ? C.amber : C.teal, opacity: hero ? 1 : 0.55 }} />
          </div>
        );
      })}
    </Frame>
  );
};

/** Thumbnail B: the big number and the German flag. */
export const L05ThumbB: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 60, top: 60, color: C.amber, fontWeight: 900, fontSize: 210, letterSpacing: "-0.06em", lineHeight: 1 }}>1,335</div>
    <div style={{ position: "absolute", left: 70, top: 280, color: C.paper, fontWeight: 900, fontSize: 110, letterSpacing: "-0.04em", lineHeight: 1 }}>HOURS</div>
    <div style={{ position: "absolute", left: 72, top: 420, color: C.slate, fontWeight: 800, fontSize: 46 }}>A German worker's year</div>
    <Flag code="DE" size={340} style={{ position: "absolute", left: 860, top: 170 }} />
  </Frame>
);
