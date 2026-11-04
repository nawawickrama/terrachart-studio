import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt, yearTrack } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

export type Line = {
  id: string;
  say: string;
  /** "rank": 29 countries and the EU average; "lines": the EU average and seven countries. */
  view: "rank" | "lines";
  /** Half-year steps: 0 is the first half of 2008, 36 the first half of 2026. */
  race: { at?: number; from?: number; to?: number };
  focus?: string[];
  note?: string;
  card?: string[];
  /** "real": the rise before and after inflation; "parts": what a price is made of; "bill": a year's bill. */
  panel?: "real" | "parts" | "bill";
  take?: string[];
  overlay?: string;
};
export const lines = words.lines as Line[];

export const { beats, total } = buildTimeline(lines, timing.timing as Record<string, number>, words.pacing);
export const lineAt = (frame: number) => lineIndexAt(lines, beats, frame);
// The ranking and the line chart each keep their own place in time.
export const rankStepAt = yearTrack(lines.filter((l) => l.view === "rank"), beats);
export const lineStepAt = yearTrack(lines.filter((l) => l.view === "lines"), beats);

/** A half-year step as a calendar year, and which half it is. */
export const yearOf = (step: number) => 2008 + Math.floor(Math.floor(step + 0.001) / 2);
export const halfOf = (step: number) => (Math.floor(step + 0.001) % 2 === 0 ? "Jan–Jun" : "Jul–Dec");
