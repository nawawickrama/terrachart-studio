import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark } from "../../shared/Logo";

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

/** 2100 projections, in millions (UN WPP 2024, medium): the five biggest after Russia. */
const BARS = [
  { code: "GB", value: 74.3 },
  { code: "DE", value: 70.9 },
  { code: "FR", value: 68.5 },
  { code: "IT", value: 35.4 },
  { code: "PL", value: 19.3 },
];

/** Thumbnail A: the 2100 ranking with hatched projection bars. */
export const L07ThumbA: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 60, top: 60, color: C.paper, fontWeight: 900, fontSize: 104, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
      1950
      <br />
      <span style={{ color: C.amber }}>→ 2100</span>
    </div>
    <div style={{ position: "absolute", left: 64, top: 300, width: 470, color: C.slate, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>
      Europe's biggest populations
    </div>
    {BARS.map((r, i) => (
      <div key={r.code} style={{ position: "absolute", left: 640, top: 90 + i * 104, display: "flex", alignItems: "center", gap: 16 }}>
        <Flag code={r.code} size={i === 0 ? 76 : 62} />
        <div
          style={{
            width: r.value * 6.6,
            height: i === 0 ? 76 : 62,
            borderRadius: "4px 32px 32px 4px",
            background: `repeating-linear-gradient(135deg, ${i === 0 ? C.amber : C.teal} 0 14px, rgba(8,19,31,0.5) 14px 22px)`,
            opacity: i === 0 ? 1 : 0.75,
          }}
        />
      </div>
    ))}
  </Frame>
);

/** Thumbnail B: the UK and German flags with a crossing arrow. */
export const L07ThumbB: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 60, top: 70, color: C.paper, fontWeight: 900, fontSize: 132, letterSpacing: "-0.05em", lineHeight: 0.95 }}>
      UK &gt;
      <br />
      <span style={{ color: C.amber }}>GERMANY?</span>
    </div>
    <div style={{ position: "absolute", left: 66, top: 360, width: 560, color: C.slate, fontWeight: 800, fontSize: 42, lineHeight: 1.15 }}>
      UN projection: the lines cross in 2059
    </div>
    <svg width={520} height={420} viewBox="0 0 520 420" style={{ position: "absolute", left: 720, top: 200 }}>
      <path d="M20 330 C 180 300, 300 200, 470 110" fill="none" stroke={C.amber} strokeWidth={16} strokeLinecap="round" />
      <path d="M20 150 C 180 170, 300 220, 470 290" fill="none" stroke={C.teal} strokeWidth={12} strokeLinecap="round" />
      <path d="M440 80 L490 100 L455 140" fill="none" stroke={C.amber} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Flag code="GB" size={150} style={{ position: "absolute", left: 1100, top: 140 }} />
    <Flag code="DE" size={150} style={{ position: "absolute", left: 1100, top: 410 }} />
  </Frame>
);
