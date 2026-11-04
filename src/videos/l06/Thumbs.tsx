import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark } from "../../shared/Logo";

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ background: `radial-gradient(900px 520px at 70% 50%, rgba(255,178,63,0.16), transparent 70%), linear-gradient(180deg, ${C.navy}, ${C.navyDeep})`, fontFamily: FONT }}
  >
    {children}
    <div style={{ position: "absolute", left: 36, bottom: 30 }}>
      <Mark size={70} />
    </div>
  </AbsoluteFill>
);

/** A plain light bulb, drawn by us. */
const Bulb: React.FC<{ size: number; style: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{ position: "absolute", ...style }}>
    <circle cx={50} cy={46} r={44} fill={C.amber} />
    <circle cx={50} cy={46} r={44} fill="none" stroke="#ffd58a" strokeWidth={3} />
    <path d="M34 82 L36 100 H64 L66 82 Z" fill={C.amber} />
    <rect x={33} y={102} width={34} height={9} rx={3} fill={C.slate} />
    <rect x={35} y={114} width={30} height={9} rx={3} fill={C.slate} />
    <rect x={40} y={126} width={20} height={8} rx={3} fill={C.slate} />
  </svg>
);

/** A price tag with a flag, hanging off the bulb. */
const Tag: React.FC<{ code: string; price: string; colour: string; style: React.CSSProperties }> = ({ code, price, colour, style }) => (
  <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 18, padding: "16px 30px 16px 20px", borderRadius: "16px 60px 60px 16px", background: C.panel, border: `4px solid ${colour}`, ...style }}>
    <Flag code={code} size={74} />
    <span style={{ color: colour, fontSize: 84, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>{price}</span>
  </div>
);

/** Thumbnail A: a light bulb with two price tags, Ireland and Hungary. */
export const L06ThumbA: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 60, top: 60, color: C.paper, fontWeight: 900, fontSize: 112, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
      <span style={{ color: C.amber }}>39c</span>
      <br />
      vs 11c
    </div>
    <div style={{ position: "absolute", left: 64, top: 300, width: 500, color: C.slate, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>
      Same electricity, three times the price
    </div>
    <Bulb size={250} style={{ left: 760, top: 110 }} />
    <Tag code="IE" price="39c" colour={C.amber} style={{ left: 600, top: 470 }} />
    <Tag code="HU" price="11c" colour={C.teal} style={{ left: 930, top: 470 }} />
  </Frame>
);

/** Thumbnail B: the Irish flag and a lightning bolt. */
export const L06ThumbB: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 60, top: 70, color: C.amber, fontWeight: 900, fontSize: 230, letterSpacing: "-0.06em", lineHeight: 1 }}>3×</div>
    <div style={{ position: "absolute", left: 70, top: 300, color: C.paper, fontWeight: 900, fontSize: 120, letterSpacing: "-0.04em", lineHeight: 1 }}>MORE</div>
    <div style={{ position: "absolute", left: 72, top: 450, width: 560, color: C.slate, fontWeight: 800, fontSize: 44, lineHeight: 1.15 }}>Ireland's power price against Hungary's</div>
    <Flag code="IE" size={360} style={{ position: "absolute", left: 800, top: 170 }} />
    <svg width={220} height={300} viewBox="0 0 22 30" style={{ position: "absolute", left: 1050, top: 60 }}>
      <path d="M13 0 L2 17 H10 L7 30 L20 11 H12 Z" fill={C.amber} stroke={C.navyDeep} strokeWidth={1} strokeLinejoin="round" />
    </svg>
  </Frame>
);
