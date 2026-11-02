import { Easing, interpolate } from "remotion";

export const FPS = 30;

/** Seconds to frames. */
export const sec = (s: number) => Math.round(s * FPS);

/** 0 before `from`, 1 after `from + frames`, eased in between. */
export const ramp = (frame: number, from: number, frames: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [from, from + Math.max(1, frames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Fades in at `from` and out at `to`. */
export const window = (frame: number, from: number, to: number, fade = sec(0.35)) =>
  ramp(frame, from, fade) * (1 - ramp(frame, to - fade, fade));
