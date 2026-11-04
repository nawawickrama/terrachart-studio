import { buildTimeline } from "../../shared/timeline";
import { lineIndexAt, yearTrack } from "../../shared/yearTrack";
import timing from "./timing.json";
import words from "./words.json";

export type Line = {
  id: string;
  say: string;
  /** "rank": 18 countries, 1950–2100; "lines": six of them as lines. */
  view: "rank" | "lines";
  race: { at?: number; from?: number; to?: number };
  focus?: string[];
  note?: string;
  card?: string[];
  /** "births": children per woman; "natural": births minus deaths; "migration": born abroad; "age": median age. */
  panel?: "births" | "natural" | "migration" | "age";
  take?: string[];
  overlay?: string;
};
export const lines = words.lines as Line[];

export const { beats, total } = buildTimeline(lines, timing.timing as Record<string, number>, words.pacing);
export const lineAt = (frame: number) => lineIndexAt(lines, beats, frame);
// The ranking and the line chart each keep their own place in time.
export const rankYearAt = yearTrack(lines.filter((l) => l.view === "rank"), beats);
export const lineYearAt = yearTrack(lines.filter((l) => l.view === "lines"), beats);

/** The last year of UN estimates; everything after is the UN's medium projection. */
export const LAST_ESTIMATE = 2023;
