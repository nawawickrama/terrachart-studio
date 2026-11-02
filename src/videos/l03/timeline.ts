import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt, yearTrack } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

export type Line = {
  id: string;
  say: string;
  /** "line": GDP per person, 1990–2025. "hours": hours worked per worker, 2023. */
  view: "line" | "hours";
  race: { at?: number; from?: number; to?: number };
  focus?: string[];
  note?: string;
  card?: string[];
  stat?: string[];
  panel?: "perHour" | "regions" | "population";
  cross?: string;
  take?: string[];
  overlay?: string;
};
export const lines = words.lines as Line[];

export const { beats, total } = buildTimeline(lines, timing.timing as Record<string, number>, words.pacing);
export const lineAt = (frame: number) => lineIndexAt(lines, beats, frame);
export const yearAt = yearTrack(lines, beats);
