import React from "react";
import { DuelShort, duelTimeline, type ShortWords } from "../shared/DuelShort";
import { LineShort, lineShortTimeline, type LineShortWords } from "../shared/LineShort";
import type { RaceData } from "../shared/Race";
import { StageShort, stageTimeline, type StageWords } from "../shared/StageShort";
import l01data from "./l01/data.json";
import l02rank from "./l02/rank.json";
import l03data from "./l03/data.json";
import l04lines from "./l04/lines.json";
import l05lines from "./l05/lines.json";
import l05rank from "./l05/rank.json";
import l06lines from "./l06/lines.json";
import l06rank from "./l06/rank.json";
import s01timing from "./s01/timing.json";
import s01words from "./s01/words.json";
import s02timing from "./s02/timing.json";
import s02words from "./s02/words.json";
import s03timing from "./s03/timing.json";
import s03words from "./s03/words.json";
import s04timing from "./s04/timing.json";
import s04words from "./s04/words.json";
import s05timing from "./s05/timing.json";
import s05words from "./s05/words.json";
import s06timing from "./s06/timing.json";
import s06words from "./s06/words.json";
export { S07, S07_FRAMES } from "./s07/S07";
import s08timing from "./s08/timing.json";
import s08words from "./s08/words.json";
export { S09, S09_FRAMES } from "./s09/S09";
import s10timing from "./s10/timing.json";
import s10words from "./s10/words.json";
import s11timing from "./s11/timing.json";
import s11words from "./s11/words.json";
import s12data from "./s12/data.json";
import s12timing from "./s12/timing.json";
import s12words from "./s12/words.json";
import s13timing from "./s13/timing.json";
import s13words from "./s13/words.json";
import s14timing from "./s14/timing.json";
import s14words from "./s14/words.json";

const gdp = l01data as RaceData;
const wages = l02rank as RaceData;
const gdppc = l03data as RaceData;
const lifeExp = l04lines as RaceData;
const hoursRank = l05rank as RaceData;
const hoursLines = l05lines as RaceData;
const priceRank = l06rank as RaceData;
const priceLines = l06lines as RaceData;
const PRICE_SOURCE = "Eurostat (nrg_pc_204), all taxes included";
const HOURS_SOURCE = "Penn World Table (2025) via Our World in Data";
const GDP_SOURCE = "World Bank, GDP (current US$)";
const WAGE_SOURCE = "Eurostat (earn_mw_cur), July 2026. PPS = purchasing power standards";
const WAGE_LABELS: [string, string] = ["In euros", "In buying power"];

export const S01: React.FC = () => (
  <DuelShort words={s01words as ShortWords} timing={s01timing.timing} data={gdp} voiceDir="voice/s01" source={GDP_SOURCE} music="music/terrachart-bed-01.wav" />
);
export const S02: React.FC = () => (
  <DuelShort words={s02words as ShortWords} timing={s02timing.timing} data={gdp} voiceDir="voice/s02" source={GDP_SOURCE} music="music/terrachart-bed-01.wav" />
);
export const S03: React.FC = () => (
  <StageShort words={s03words as StageWords} timing={s03timing.timing} data={wages} voiceDir="voice/s03" source={WAGE_SOURCE} music="music/terrachart-bed-02.wav" labels={WAGE_LABELS} />
);
export const S04: React.FC = () => (
  <StageShort words={s04words as StageWords} timing={s04timing.timing} data={wages} voiceDir="voice/s04" source={WAGE_SOURCE} music="music/terrachart-bed-02.wav" labels={WAGE_LABELS} />
);
export const S05: React.FC = () => (
  <DuelShort words={s05words as ShortWords} timing={s05timing.timing} data={gdp} voiceDir="voice/s05" source={GDP_SOURCE} music="music/terrachart-bed-01.wav" />
);

export const S06: React.FC = () => (
  <LineShort
    words={s06words as LineShortWords}
    timing={s06timing.timing}
    data={gdppc}
    voiceDir="voice/s06"
    source="World Bank (GDP per capita, PPP, 2021 prices)"
    music="music/terrachart-bed-03.wav"
    yMin={10000}
    yMax={55000}
  />
);

export const S08: React.FC = () => (
  <LineShort
    words={s08words as LineShortWords}
    timing={s08timing.timing}
    data={lifeExp}
    voiceDir="voice/s08"
    source="UN World Population Prospects 2024, via Our World in Data"
    music="music/terrachart-bed-04.wav"
    yMin={55}
    yMax={90}
    yStep={5}
    xStep={20}
    format={(v) => v.toFixed(1)}
    axisFormat={(v) => `${v}`}
  />
);

export const S10: React.FC = () => (
  <StageShort
    words={s10words as StageWords}
    timing={s10timing.timing}
    data={hoursRank}
    voiceDir="voice/s10"
    source={HOURS_SOURCE}
    music="music/terrachart-bed-05.wav"
    labels={["2023", "2023"]}
    format={(v) => `${Math.round(v).toLocaleString("en-GB")} h`}
  />
);

export const S11: React.FC = () => (
  <LineShort
    words={s11words as LineShortWords}
    timing={s11timing.timing}
    data={hoursLines}
    voiceDir="voice/s11"
    source={HOURS_SOURCE}
    music="music/terrachart-bed-05.wav"
    yMin={1200}
    yMax={2200}
    yStep={200}
    xStep={10}
    format={(v) => Math.round(v).toLocaleString("en-GB")}
    axisFormat={(v) => v.toLocaleString("en-GB")}
  />
);

export const S12: React.FC = () => (
  <LineShort
    words={s12words as LineShortWords}
    timing={s12timing.timing}
    data={s12data as RaceData}
    voiceDir="voice/s12"
    source="Eurostat (prc_hpi_a), rebased to 2010 = 100 by Terrachart"
    music="music/terrachart-bed-02.wav"
    yMin={50}
    yMax={300}
    yStep={50}
    xStep={5}
    format={(v) => `${v >= 100 ? "+" : "−"}${Math.abs(Math.round(v - 100))}%`}
    axisFormat={(v) => (v === 100 ? "2010" : `${v > 100 ? "+" : "−"}${Math.abs(v - 100)}%`)}
  />
);

export const S13: React.FC = () => (
  <StageShort
    words={s13words as StageWords}
    timing={s13timing.timing}
    data={priceRank}
    voiceDir="voice/s13"
    source={PRICE_SOURCE}
    music="music/terrachart-bed-06.wav"
    labels={["Early 2026", "Early 2026"]}
    format={(v) => `${Math.round(v)}c`}
  />
);

// Eurostat publishes these prices every six months: step 0 is the first half of 2008, step 36 the first half of 2026.
const halfYear = (t: number) => {
  const step = Math.floor(t + 0.001);
  return `${step % 2 === 0 ? "Early" : "Late"} ${2008 + Math.floor(step / 2)}`;
};

export const S14: React.FC = () => (
  <LineShort
    words={s14words as LineShortWords}
    timing={s14timing.timing}
    data={priceLines}
    voiceDir="voice/s14"
    source={PRICE_SOURCE}
    music="music/terrachart-bed-06.wav"
    yMin={0}
    yMax={70}
    yStep={10}
    xStep={8}
    format={(v) => `${Math.round(v)}c`}
    axisFormat={(v) => `${v}c`}
    timeLabel={(t) => String(2008 + t / 2)}
    counterLabel={halfYear}
  />
);

export const S01_FRAMES = duelTimeline(s01words as ShortWords, s01timing.timing).total;
export const S02_FRAMES = duelTimeline(s02words as ShortWords, s02timing.timing).total;
export const S03_FRAMES = stageTimeline(s03words as StageWords, s03timing.timing).total;
export const S04_FRAMES = stageTimeline(s04words as StageWords, s04timing.timing).total;
export const S05_FRAMES = duelTimeline(s05words as ShortWords, s05timing.timing).total;
export const S06_FRAMES = lineShortTimeline(s06words as LineShortWords, s06timing.timing).total;
export const S08_FRAMES = lineShortTimeline(s08words as LineShortWords, s08timing.timing).total;
export const S10_FRAMES = stageTimeline(s10words as StageWords, s10timing.timing).total;
export const S11_FRAMES = lineShortTimeline(s11words as LineShortWords, s11timing.timing).total;
export const S12_FRAMES = lineShortTimeline(s12words as LineShortWords, s12timing.timing).total;
export const S13_FRAMES = stageTimeline(s13words as StageWords, s13timing.timing).total;
export const S14_FRAMES = lineShortTimeline(s14words as LineShortWords, s14timing.timing).total;
