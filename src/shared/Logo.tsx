import React from "react";
import { C, FONT } from "../brand";

/** The Terrachart mark: a globe with a ranking inside, the amber leader breaking out. */
export const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="earth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2cc9b5" />
        <stop offset="1" stopColor="#119585" />
      </linearGradient>
      <clipPath id="globe">
        <circle cx={46} cy={50} r={32} />
      </clipPath>
      <clipPath id="lead">
        <circle cx={46} cy={50} r={32} />
        <rect x={46} y={0} width={54} height={100} />
      </clipPath>
    </defs>
    <circle cx={46} cy={50} r={32} fill="url(#earth)" />
    <g clipPath="url(#globe)" fill={C.navy}>
      <rect x={0} y={39.5} width={64} height={8} rx={4} />
      <rect x={0} y={52.5} width={54} height={8} rx={4} />
      <rect x={0} y={65.5} width={41} height={8} rx={4} />
    </g>
    <rect x={0} y={26.5} width={90} height={8} rx={4} fill={C.amber} clipPath="url(#lead)" />
  </svg>
);

export const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: "-0.035em", color: C.paper, lineHeight: 1 }}>
    terra<span style={{ color: C.amber }}>chart</span>
  </span>
);
