/**
 * Prints a video's YouTube chapters from its words.json and timing.json,
 * using the same pauses as the animation.
 *
 *   node scripts/chapters.mjs l01
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const video = process.argv[2] ?? "l01";
const dir = join(new URL("..", import.meta.url).pathname, "src/videos", video);
const words = JSON.parse(readFileSync(join(dir, "words.json"), "utf8"));
const { timing } = JSON.parse(readFileSync(join(dir, "timing.json"), "utf8"));
const { lead, pause, pauseAfter = {}, tail } = words.pacing;
let at = lead;
const starts = {};
for (const line of words.lines) {
  starts[line.id] = at;
  at += timing[line.id] + (pauseAfter[line.id] ?? pause);
}
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
Object.entries(words.chapters).forEach(([id, title], i) => console.log(`${i === 0 ? "0:00" : mmss(starts[id])} ${title}`));
const last = words.lines[words.lines.length - 1].id;
console.log(`(length ${mmss(starts[last] + timing[last] + tail)})`);
