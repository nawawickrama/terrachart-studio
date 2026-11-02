/**
 * Writes a caption file (.srt) from a video's exact narration and timing, so
 * YouTube shows our words instead of guessing them. Long lines are split into
 * short captions, timed by their share of the line's characters.
 *
 *   node scripts/captions.mjs l01 out/L01.srt
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [video = "l01", output = `out/${video}.srt`] = process.argv.slice(2);
const dir = join(new URL("..", import.meta.url).pathname, "src/videos", video);
const words = JSON.parse(readFileSync(join(dir, "words.json"), "utf8"));
const { timing } = JSON.parse(readFileSync(join(dir, "timing.json"), "utf8"));
const { lead, pause, pauseAfter = {} } = words.pacing;

/** Splits text into pieces of at most about 84 characters (two lines of 42), at sentence or comma breaks where possible. */
function pieces(text) {
  const parts = text.match(/[^.?!:;,]+[.?!:;,]*\s*/g) ?? [text];
  const out = [];
  let current = "";
  for (const p of parts) {
    if ((current + p).trim().length > 84 && current) {
      out.push(current.trim());
      current = "";
    }
    current += p;
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

const stamp = (s) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, "0")}`;
};

let at = lead;
let n = 1;
const blocks = [];
for (const line of words.lines) {
  const length = timing[line.id];
  const chunks = pieces(line.say);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  let t = at;
  for (const c of chunks) {
    const d = (c.length / total) * length;
    blocks.push(`${n++}\n${stamp(t)} --> ${stamp(t + d)}\n${c}\n`);
    t += d;
  }
  at += length + (pauseAfter[line.id] ?? pause);
}
writeFileSync(output, blocks.join("\n"));
console.log(`${output}: ${blocks.length} captions`);
