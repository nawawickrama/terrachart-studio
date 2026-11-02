import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt, yearTrack } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

export type Line = {
  id: string;
  say: string;
  /** "map": the tile map; "lines": ten countries, 1950–2023; "dip": the pandemic years close up. */
  view: "map" | "lines" | "dip";
  race: { at?: number; from?: number; to?: number };
  focus?: string[];
  note?: string;
  card?: string[];
  panel?: "health";
  cross?: string;
  take?: string[];
  overlay?: string;
  /** A different source for this line's figures (shown at the bottom while it plays). */
  src?: "child";
};
export const lines = words.lines as Line[];

export const { beats, total } = buildTimeline(lines, timing.timing as Record<string, number>, words.pacing);
export const lineAt = (frame: number) => lineIndexAt(lines, beats, frame);
// The map and the long line chart share one year; the pandemic close-up keeps its own.
export const yearAt = yearTrack(lines.filter((l) => l.view !== "dip"), beats);
export const dipAt = yearTrack(lines.filter((l) => l.view === "dip"), beats);
