import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../brand";
import { Flag } from "../../shared/Flag";
import { Mark } from "../../shared/Logo";
import { TileMap, type Tile } from "../../shared/TileMap";
import mapData from "./map.json";

const SOUTH = ["Spain", "Italy", "Portugal", "Malta", "Greece", "Cyprus"];

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

/** Thumbnail A: the 2023 tile map with the south lit up. */
export const L04ThumbA: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 60, top: 60, color: C.amber, fontWeight: 900, fontSize: 112, letterSpacing: "-0.04em", lineHeight: 0.95 }}>
      THE
      <br />
      SOUTH
      <br />
      <span style={{ color: C.paper }}>WINS</span>
    </div>
    <div style={{ position: "absolute", left: 64, top: 420, width: 470, color: C.slate, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>
      Life expectancy in Europe, 1950 → 2023
    </div>
    <TileMap
      tiles={mapData.tiles as Tile[]}
      years={mapData.years}
      year={2023}
      level={(name) => (SOUTH.includes(name) ? 2 : 0.6)}
      x={640}
      y={92}
      pitch={64}
      size={58}
      showValues={false}
    />
  </Frame>
);

/** Thumbnail B: Spain's flag and its 22 extra years. */
export const L04ThumbB: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 60, top: 40, color: C.amber, fontWeight: 900, fontSize: 250, letterSpacing: "-0.06em", lineHeight: 1 }}>+22</div>
    <div style={{ position: "absolute", left: 70, top: 285, color: C.paper, fontWeight: 900, fontSize: 110, letterSpacing: "-0.04em", lineHeight: 1 }}>YEARS</div>
    <div style={{ position: "absolute", left: 72, top: 425, color: C.slate, fontWeight: 800, fontSize: 46 }}>Spain: 62 → 84 years of life</div>
    <Flag code="ES" size={380} style={{ position: "absolute", left: 800, top: 150 }} />
  </Frame>
);
