/**
 * Records a video's narration with Kokoro, one file per line, and writes how
 * long each line lasts so the animation can follow it.
 *
 *   npm run voice -- l01            every line
 *   npm run voice -- l01 hook_a     one line again, after changing its words
 *
 * Kokoro (hexgrad/Kokoro-82M) is Apache 2.0 and runs on this Mac. Terrachart
 * uses the voice af_heart. Never use the Mac's own `say` voices here: their
 * licence is for personal, non-commercial use.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { KokoroTTS } from "kokoro-js";

const [video = "l01", only] = process.argv.slice(2);
const root = new URL("..", import.meta.url).pathname;
const wordsFile = join(root, "src/videos", video, "words.json");
const timingFile = join(root, "src/videos", video, "timing.json");
const words = JSON.parse(readFileSync(wordsFile, "utf8"));
const { name: voice, speed = 1 } = words.voice;
const outDir = join(root, "public/voice", video);
mkdirSync(outDir, { recursive: true });

/** Spellings that make Kokoro say a word the way we want. The screen keeps the real spelling. */
const spoken = { Terrachart: "Terra chart", "il sorpasso": "eel sor-passo", Lubelskie: "Loo-bell-skyeh" };
const toSpeech = (text) => Object.entries(spoken).reduce((said, [w, s]) => said.replaceAll(w, s), text);

/** Seconds of sound in a WAV file, read from its header. */
function wavSeconds(file) {
  const buf = readFileSync(file);
  let offset = 12;
  let byteRate = 0;
  while (offset < buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "fmt ") byteRate = buf.readUInt32LE(offset + 16);
    if (id === "data") return size / byteRate;
    offset += 8 + size + (size % 2);
  }
  throw new Error(`No sound found in ${file}`);
}

/** Every line at the same loudness (about -20 dBFS) without clipping, so the music can sit at one level. */
function level(samples) {
  let sum = 0;
  let peak = 0;
  for (const s of samples) {
    sum += s * s;
    peak = Math.max(peak, Math.abs(s));
  }
  const gain = Math.min(0.1 / Math.sqrt(sum / samples.length), 0.95 / peak);
  for (let i = 0; i < samples.length; i++) samples[i] *= gain;
}

const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "fp32", device: "cpu" });
const timing = existsSync(timingFile) ? JSON.parse(readFileSync(timingFile, "utf8")).timing : {};
for (const line of words.lines) {
  if (only && line.id !== only) continue;
  const file = join(outDir, `${line.id}.wav`);
  const audio = await tts.generate(toSpeech(line.say), { voice, speed });
  level(audio.audio);
  await audio.save(file);
  timing[line.id] = Number(wavSeconds(file).toFixed(3));
  console.log(line.id, timing[line.id], "s");
}
writeFileSync(timingFile, JSON.stringify({ voice, timing }, null, 2) + "\n");
const total = Object.values(timing).reduce((a, b) => a + b, 0);
console.log(`${Object.keys(timing).length} lines, ${total.toFixed(1)} s of narration`);
