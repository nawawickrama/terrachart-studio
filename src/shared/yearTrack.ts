import { Easing, interpolate } from "remotion";
import { sec } from "./motion";
import type { Beats } from "./timeline";

export type RaceLine = { id: string; race: { at?: number; from?: number; to?: number } };

/**
 * Which year the chart shows at each frame. A line with `at` moves quickly to
 * that year and holds it; a line with `from`/`to` moves between them across
 * its whole time on screen (the line plus the pause after it).
 */
export function yearTrack(lines: RaceLine[], beats: Beats) {
  const keys: [number, number][] = [];
  const push = (f: number, y: number) => {
    const last = keys[keys.length - 1];
    keys.push([last && f <= last[0] ? last[0] + 1 : f, y]);
  };
  let prev = lines[0].race.at ?? lines[0].race.from ?? 0;
  for (const l of lines) {
    const b = beats[l.id];
    if (l.race.at !== undefined) {
      push(b.from, prev);
      if (prev !== l.race.at) push(b.from + sec(1.4), l.race.at);
      push(b.until, l.race.at);
      prev = l.race.at;
    } else {
      const from = l.race.from as number;
      const to = l.race.to as number;
      push(b.from, prev);
      if (prev !== from) push(b.from + sec(0.8), from);
      push(b.until - sec(0.3), to);
      push(b.until, to);
      prev = to;
    }
  }
  return (frame: number) => {
    for (let i = 1; i < keys.length; i++) {
      const [f0, y0] = keys[i - 1];
      const [f1, y1] = keys[i];
      if (frame <= f1) {
        return interpolate(frame, [f0, f1], [y0, y1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.sin),
        });
      }
    }
    return keys[keys.length - 1][1];
  };
}

/** The line on screen at a frame: the last one that has started. */
export const lineIndexAt = (lines: { id: string }[], beats: Beats, frame: number) => {
  let current = 0;
  lines.forEach((l, i) => {
    if (frame >= beats[l.id].from) current = i;
  });
  return current;
};
