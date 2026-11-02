import React from "react";
import { Easing, Html5Audio, staticFile } from "remotion";
import { ramp, sec } from "./motion";
import type { Beats } from "./timeline";

/**
 * Background music that fades in, dips under every voice line, comes back up
 * in the pauses, and fades out at the end. The defaults suit our own tracks
 * (about -18 dBFS) under voice lines levelled to about -20 dBFS.
 */
export const MusicBed: React.FC<{ src: string; beats: Beats; total: number; under?: number; between?: number }> = ({
  src,
  beats,
  total,
  under = 0.1,
  between = 0.3,
}) => {
  const lines = Object.values(beats);
  const volume = (f: number) => {
    const fade = ramp(f, 0, sec(1)) * (1 - ramp(f, total - sec(4), sec(4), Easing.inOut(Easing.quad)));
    const duck = lines.reduce(
      (most, b) =>
        Math.max(most, ramp(f, b.from - sec(0.3), sec(0.3), Easing.linear) * (1 - ramp(f, b.from + b.frames, sec(0.5), Easing.linear))),
      0,
    );
    return (between - (between - under) * duck) * fade;
  };
  return <Html5Audio src={staticFile(src)} volume={volume} />;
};
