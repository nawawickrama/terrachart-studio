/**
 * Photographs single frames to check a video without rendering all of it.
 *
 *   npm run stills -- L01 12 95.5 300      frames at those seconds
 *   npm run stills -- L01ThumbA            a thumbnail (frame 0)
 *
 * Writes to out/stills/<id>-<second>.png
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [id = "L01", ...seconds] = process.argv.slice(2);
const root = new URL("..", import.meta.url).pathname;
const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
const outDir = join(root, "out/stills");
mkdirSync(outDir, { recursive: true });
console.log(`${id}: ${(composition.durationInFrames / composition.fps).toFixed(1)} s`);
for (const s of seconds.length ? seconds : ["0"]) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  const output = join(outDir, `${id}-${s}.png`);
  await renderStill({ composition, serveUrl, output, frame });
  console.log(output);
}
