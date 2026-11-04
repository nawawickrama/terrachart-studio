import React from "react";

/**
 * Round flag badges, drawn by us so there is nothing to license. Each flag is
 * drawn into a 30 x 30 square and cut to a circle.
 */
const stripes = (dir: "h" | "v", colours: string[]) =>
  colours.map((c, i) => {
    const size = 30 / colours.length;
    return dir === "h" ? (
      <rect key={i} x={0} y={i * size} width={30} height={size + 0.2} fill={c} />
    ) : (
      <rect key={i} x={i * size} y={0} width={size + 0.2} height={30} fill={c} />
    );
  });

const nordic = (bg: string, cross: string, inner?: string) => (
  <>
    <rect width={30} height={30} fill={bg} />
    <rect x={8} y={0} width={inner ? 8 : 5} height={30} fill={cross} />
    <rect x={0} y={inner ? 11 : 12.5} width={30} height={inner ? 8 : 5} fill={cross} />
    {inner && (
      <>
        <rect x={10} y={0} width={4} height={30} fill={inner} />
        <rect x={0} y={13} width={30} height={4} fill={inner} />
      </>
    )}
  </>
);

const FLAGS: Record<string, React.ReactNode> = {
  DE: stripes("h", ["#000000", "#dd0000", "#ffce00"]),
  RU: stripes("h", ["#ffffff", "#0039a6", "#d52b1e"]),
  UA: stripes("h", ["#0057b7", "#ffd700"]),
  FI: nordic("#ffffff", "#003580"),
  IS: nordic("#02529c", "#ffffff", "#dc1e35"),
  FR: stripes("v", ["#002395", "#ffffff", "#ed2939"]),
  IT: stripes("v", ["#009246", "#ffffff", "#ce2b37"]),
  NL: stripes("h", ["#ae1c28", "#ffffff", "#21468b"]),
  BE: stripes("v", ["#000000", "#fae042", "#ed2939"]),
  IE: stripes("v", ["#169b62", "#ffffff", "#ff883e"]),
  AT: stripes("h", ["#ed2939", "#ffffff", "#ed2939"]),
  PL: stripes("h", ["#ffffff", "#dc143c"]),
  ES: (
    <>
      <rect width={30} height={30} fill="#aa151b" />
      <rect y={7.5} width={30} height={15} fill="#f1bf00" />
    </>
  ),
  CH: (
    <>
      <rect width={30} height={30} fill="#da291c" />
      <rect x={12.5} y={6} width={5} height={18} fill="#fff" />
      <rect x={6} y={12.5} width={18} height={5} fill="#fff" />
    </>
  ),
  SE: nordic("#006aa7", "#fecc00"),
  DK: nordic("#c8102e", "#ffffff"),
  NO: nordic("#ba0c2f", "#ffffff", "#00205b"),
  LU: stripes("h", ["#ed2939", "#ffffff", "#00a1de"]),
  LT: stripes("h", ["#fdb913", "#006a44", "#c1272d"]),
  EE: stripes("h", ["#0072ce", "#000000", "#ffffff"]),
  HU: stripes("h", ["#ce2939", "#ffffff", "#477050"]),
  BG: stripes("h", ["#ffffff", "#00966e", "#d62612"]),
  RO: stripes("v", ["#002b7f", "#fcd116", "#ce1126"]),
  LV: (
    <>
      <rect width={30} height={30} fill="#9e3039" />
      <rect y={12} width={30} height={6} fill="#ffffff" />
    </>
  ),
  CZ: (
    <>
      <rect width={30} height={15} fill="#ffffff" />
      <rect y={15} width={30} height={15} fill="#d7141a" />
      <path d="M0 0 L16 15 L0 30 Z" fill="#11457e" />
    </>
  ),
  PT: (
    <>
      <rect width={12} height={30} fill="#006600" />
      <rect x={12} width={18} height={30} fill="#ff0000" />
      <circle cx={12} cy={15} r={5.5} fill="#ffcc00" />
      <circle cx={12} cy={15} r={3} fill="#ff0000" stroke="#ffffff" strokeWidth={0.8} />
    </>
  ),
  GR: (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} y={(i * 30) / 9} width={30} height={30 / 9 + 0.2} fill={i % 2 ? "#ffffff" : "#0d5eaf"} />
      ))}
      <rect width={16.7} height={16.7} fill="#0d5eaf" />
      <rect x={6.7} width={3.3} height={16.7} fill="#ffffff" />
      <rect y={6.7} width={16.7} height={3.3} fill="#ffffff" />
    </>
  ),
  HR: (
    <>
      {stripes("h", ["#ff0000", "#ffffff", "#171796"])}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={11 + (i % 4) * 2} y={9 + Math.floor(i / 4) * 2.5} width={2} height={2.5} fill={(i + Math.floor(i / 4)) % 2 ? "#ffffff" : "#ff0000"} />
      ))}
      <rect x={11} y={9} width={8} height={10} fill="none" stroke="#171796" strokeWidth={0.6} />
    </>
  ),
  SI: (
    <>
      {stripes("h", ["#ffffff", "#005da4", "#ed1c24"])}
      <path d="M5 5 H13 V11 Q13 15 9 16 Q5 15 5 11 Z" fill="#005da4" stroke="#ed1c24" strokeWidth={0.9} />
      <path d="M6 12.5 L8 9.5 L9 11 L10 9.5 L12 12.5 Z" fill="#ffffff" />
    </>
  ),
  SK: (
    <>
      {stripes("h", ["#ffffff", "#0b4ea2", "#ee1c25"])}
      <path d="M6 7 H15 V17 Q15 22 10.5 23.5 Q6 22 6 17 Z" fill="#ee1c25" stroke="#ffffff" strokeWidth={0.9} />
      <rect x={10} y={9} width={1.2} height={10} fill="#ffffff" />
      <rect x={8} y={11} width={5.2} height={1.1} fill="#ffffff" />
      <rect x={7.5} y={13.6} width={6.2} height={1.1} fill="#ffffff" />
      <path d="M6.5 19 Q8.5 16.5 10.5 18.5 Q12.5 16.5 14.5 19 L14.5 20.5 H6.5 Z" fill="#0b4ea2" />
    </>
  ),
  MT: (
    <>
      <rect width={15} height={30} fill="#ffffff" />
      <rect x={15} width={15} height={30} fill="#cf142b" />
      <path d="M4 3 h2 v2 h2 v2 h-2 v2 h-2 v-2 h-2 v-2 h2 Z" fill="#a0a0a0" stroke="#cf142b" strokeWidth={0.4} />
    </>
  ),
  CY: (
    <>
      <rect width={30} height={30} fill="#ffffff" />
      <path d="M6 13 Q9 9 15 10 Q20 9 25 8 Q22 12 18 13 Q14 16 8 15 Z" fill="#d57800" />
      <path d="M9 19 Q15 23 21 19" stroke="#4e5b31" strokeWidth={1.4} fill="none" />
    </>
  ),
  GB: (
    <>
      <rect width={30} height={30} fill="#012169" />
      <path d="M0 0 L30 30 M30 0 L0 30" stroke="#fff" strokeWidth={6} />
      <path d="M0 0 L30 30 M30 0 L0 30" stroke="#c8102e" strokeWidth={2} />
      <path d="M15 0 V30 M0 15 H30" stroke="#fff" strokeWidth={10} />
      <path d="M15 0 V30 M0 15 H30" stroke="#c8102e" strokeWidth={6} />
    </>
  ),
  // Belarus: red over green, with the white-and-red ornament band at the hoist, simplified to a column of diamonds.
  BY: (
    <>
      <rect width={30} height={30} fill="#c8313e" />
      <rect y={20} width={30} height={10} fill="#4aa657" />
      <rect width={6} height={30} fill="#ffffff" />
      {[3, 9, 15, 21, 27].map((y) => (
        <path key={y} d={`M3 ${y - 2} L5 ${y} L3 ${y + 2} L1 ${y} Z`} fill="#c8313e" />
      ))}
    </>
  ),
  // The European Union: twelve gold stars in a ring, drawn as dots so they stay crisp at badge size.
  EU: (
    <>
      <rect width={30} height={30} fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={15 + 8.5 * Math.sin((i * Math.PI) / 6)} cy={15 - 8.5 * Math.cos((i * Math.PI) / 6)} r={1.5} fill="#ffcc00" />
      ))}
    </>
  ),
};

export const Flag: React.FC<{ code: string; size: number; style?: React.CSSProperties }> = ({ code, size, style }) => {
  const id = `flag-${code}`;
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" style={style}>
      <defs>
        <clipPath id={id}>
          <circle cx={15} cy={15} r={15} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{FLAGS[code]}</g>
      <circle cx={15} cy={15} r={14.5} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
    </svg>
  );
};
