import React from "react";
import { DuelShort, duelTimeline, type ShortWords } from "../shared/DuelShort";
import { LineShort, lineShortTimeline, type LineShortWords } from "../shared/LineShort";
import type { RaceData } from "../shared/Race";
import { StageShort, stageTimeline, type StageWords } from "../shared/StageShort";
import l01data from "./l01/data.json";
import l02rank from "./l02/rank.json";
import l03data from "./l03/data.json";
import l04lines from "./l04/lines.json";
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

const gdp = l01data as RaceData;
const wages = l02rank as RaceData;
const gdppc = l03data as RaceData;
const lifeExp = l04lines as RaceData;
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

export const S01_FRAMES = duelTimeline(s01words as ShortWords, s01timing.timing).total;
export const S02_FRAMES = duelTimeline(s02words as ShortWords, s02timing.timing).total;
export const S03_FRAMES = stageTimeline(s03words as StageWords, s03timing.timing).total;
export const S04_FRAMES = stageTimeline(s04words as StageWords, s04timing.timing).total;
export const S05_FRAMES = duelTimeline(s05words as ShortWords, s05timing.timing).total;
export const S06_FRAMES = lineShortTimeline(s06words as LineShortWords, s06timing.timing).total;
export const S08_FRAMES = lineShortTimeline(s08words as LineShortWords, s08timing.timing).total;
