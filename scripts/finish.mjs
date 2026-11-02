/**
 * Makes a rendered video ready for YouTube: brings the sound to -14 LUFS with
 * peaks under -1.5 dB (YouTube turns loud videos down but never turns quiet
 * ones up), in two passes, without re-encoding the picture.
 *
 *   node scripts/finish.mjs out/L01.mp4 out/L01-final.mp4
 */
import { spawnSync } from "node:child_process";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node scripts/finish.mjs <in.mp4> <out.mp4>");
const target = "I=-14:TP=-1.5:LRA=11";

/** Runs Remotion's own ffmpeg; it reports loudness on stderr. */
function ffmpeg(args) {
  const run = spawnSync("npx", ["remotion", "ffmpeg", "-hide_banner", ...args], { encoding: "utf8" });
  if (run.status !== 0) throw new Error(run.stderr);
  return run.stderr;
}

const report = ffmpeg(["-nostats", "-i", input, "-vn", "-af", `loudnorm=${target}:print_format=json`, "-f", "null", "-"]);
const m = JSON.parse(report.slice(report.lastIndexOf("{"), report.lastIndexOf("}") + 1));
const filter = `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`;
ffmpeg(["-loglevel", "error", "-i", input, "-c:v", "copy", "-af", filter, "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", "-y", output]);
console.log(`${output}: sound was ${m.input_i} LUFS, now about -14 LUFS`);
