import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt, yearTrack } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

export type Line = {
  id: string;
  say: string;
  /** "rank": July 2026, from euros (0) to buying power (1). "growth": euros every July, 2016–2026. */
  view: "rank" | "growth";
  race: { at?: number; from?: number; to?: number };
  focus?: string[];
  note?: string;
  card?: string[];
  take?: string[];
  overlay?: string;
};
export const lines = words.lines as Line[];

export const { beats, total } = buildTimeline(lines, timing.timing as Record<string, number>, words.pacing);
export const lineAt = (frame: number) => lineIndexAt(lines, beats, frame);

// Each chart keeps its own track, so switching from one to the other never animates between them.
export const stageAt = yearTrack(lines.filter((l) => l.view === "rank"), beats);
export const yearAt = yearTrack(lines.filter((l) => l.view === "growth"), beats);
