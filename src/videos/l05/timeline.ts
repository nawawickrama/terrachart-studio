import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt, yearTrack } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

export type Line = {
  id: string;
  say: string;
  /** "rank": 31 countries in 2023; "lines": eight countries, 1970–2023. */
  view: "rank" | "lines";
  race: { at?: number; from?: number; to?: number };
  focus?: string[];
  note?: string;
  card?: string[];
  /** "long": 1870 against 2023; "hour": output per hour; "us" and "asia": comparisons outside Europe. */
  panel?: "long" | "hour" | "us" | "asia";
  take?: string[];
  overlay?: string;
};
export const lines = words.lines as Line[];

export const { beats, total } = buildTimeline(lines, timing.timing as Record<string, number>, words.pacing);
export const lineAt = (frame: number) => lineIndexAt(lines, beats, frame);
// Only the line chart moves through time; the ranking always shows 2023.
export const yearAt = yearTrack(lines.filter((l) => l.view === "lines"), beats);
