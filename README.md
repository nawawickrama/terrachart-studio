# Terrachart Studio

The channel's videos, written as code with [Remotion](https://www.remotion.dev) and rendered to MP4. Rules for what goes in them: `~/Documents/YouTube/Guidelines`. What to make and when: `~/Documents/YouTube/Content plan`.

| Video | What it is | Length |
|---|---|---|
| `L01` | Europe's biggest economies, 1970–2025 (bar chart race) | 8:02 |
| `S01` | Short: Poland vs Switzerland | 40 s |
| `S02` | Short: il sorpasso, Italy vs the UK | 43 s |
| `S05` | Short: Ireland vs Sweden | 45 s |
| `L02` | Minimum wage in every EU country, euros vs buying power (ranking, then a 2016–2026 race) | 8:23 |
| `S03`, `S04` | Shorts: the real number 1 minimum wage; Romania vs Portugal vs Greece | 35 s, 39 s |
| `L03` | How Poland caught up, 1990–2025 (line chart race, then hours, regions and population panels) | 8:36 |
| `S06`, `S07` | Shorts: Spain is next (line race); Poland vs Germany hours | 49 s, 45 s |
| `L04` | Life expectancy in Europe, 1950–2023 (tile map of 40 countries, line race, pandemic close-up) | 8:13 |
| `S08`, `S09` | Shorts: Spain +22 years (line race); Germany vs Spain, health spending and years of life | 42 s, 36 s |

The tile map (`src/shared/TileMap.tsx`) puts one square per country roughly where it sits in Europe and colours it by value; its root has `zIndex: 0` so raised tiles never cover cards, title cards or end screens drawn after it.

Line chart races (`src/shared/LineRace.tsx`, used by L03 and `LineShort.tsx`) draw each country's line up to the current year with its name at the end; names are pushed apart so they never overlap, and rings mark where the hero passes another country. When a line of narration names a year, that line must jump the chart to that year (`race.at`), or the year before it must run there (`race.from`/`race.to`) with words that don't name the year. Check the counter against the voice in the stills.

Shorts with two countries (`src/shared/DuelShort.tsx`) rank the pair only between themselves, and the bars change places at the moment one passes the other. Check frames across the whole Short, not only the last one.

## Making a video

```
npm install
node scripts/voice.mjs l01                  record the narration (Kokoro, af_heart), one file per line
node scripts/voice.mjs l01 hook_a           re-record one line after changing it
python3 scripts/music.py 01 540             write our own background track (needs numpy)
npm run studio                              watch and scrub in the browser
node scripts/stills.mjs L01 12 95.5         photograph frames at those seconds into out/stills
npx remotion render L01 out/L01.mp4         render (run long renders under caffeinate -dis)
node scripts/finish.mjs out/L01.mp4 out/L01-final.mp4   sound to -14 LUFS for YouTube
node scripts/captions.mjs l01 out/L01.srt   exact captions from the narration
node scripts/chapters.mjs l01               YouTube chapter times
```

Finished files, thumbnails, captions and an `Upload details.md` go to `~/Documents/YouTube/Videos/<ID>/`.

## How a video is put together

Each video's `words.json` holds the narration lines and, per line, what the chart does: `race.at` (jump to a year and hold) or `race.from`/`race.to` (run between years across the line), `focus` (countries in amber), `note` (caption), `card` or `overlay`. `pacing` sets the pauses and `chapters` the YouTube chapters. The narration's length (in `timing.json`, written by the voice script) times everything, so re-recording a line moves the animation with it.

Data for a race lives next to it (`data.json`), made from the downloaded source files in `~/Documents/YouTube/Data/`.

## What's ours and what's licensed

- Narration: Kokoro-82M (Apache 2.0), voice `af_heart`. Never the Mac's `say` voices (non-commercial licence).
- Music: our own, from `scripts/music.py`. Nothing sampled.
- Font: Inter (SIL Open Font License), `public/fonts`.
- Flags and logo: drawn in code (`src/shared/Flag.tsx`, `src/shared/Logo.tsx`).
- Remotion: free for individuals and companies of up to three people.

The Kokoro model was copied from the Coredile videos project into `node_modules/@huggingface/transformers/.cache`. A fresh `npm install` downloads it again (about 330 MB) on the first voice run.
