import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt, yearTrack } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

export type Line = {
  id: string;
  say: string;
  race: { at?: number; from?: number; to?: number };
  focus?: string[];
  note?: string;
  card?: string[];
  take?: string[];
  overlay?: string;
};
export const lines = words.lines as Line[];

/** Pauses between lines live in words.json, so the chapter times can be worked out from the same numbers. */
export const { beats, total } = buildTimeline(lines, timing.timing as Record<string, number>, words.pacing);

export const lineAt = (frame: number) => lineIndexAt(lines, beats, frame);
export const yearAt = yearTrack(lines, beats);
