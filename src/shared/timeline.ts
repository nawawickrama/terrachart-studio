/**
 * When each voice line starts, in frames. Everything on screen is timed from
 * these beats, so re-recording the voice (npm run voice) moves the animation
 * with it.
 */
import { sec } from "./motion";

export type Beat = { from: number; frames: number; /** Where the next line starts (or the end). */ until: number };
export type Beats = Record<string, Beat>;

export type Pacing = {
  lead: number;
  tail: number;
  pause: number;
  pauseAfter?: Record<string, number>;
};

export function buildTimeline(lines: { id: string }[], seconds: Record<string, number>, pacing: Pacing) {
  const beats: Beats = {};
  let at = pacing.lead;
  for (const line of lines) {
    beats[line.id] = { from: sec(at), frames: sec(seconds[line.id]), until: 0 };
    at += seconds[line.id] + (pacing.pauseAfter?.[line.id] ?? pacing.pause);
  }
  const last = beats[lines[lines.length - 1].id];
  const total = last.from + last.frames + sec(pacing.tail);
  lines.forEach((line, i) => {
    beats[line.id].until = i + 1 < lines.length ? beats[lines[i + 1].id].from : total;
  });
  return { beats, total };
}
