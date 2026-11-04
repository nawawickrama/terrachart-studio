import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { FPS } from "./shared/motion";
import { L01 } from "./videos/l01/L01";
import { L01ThumbA, L01ThumbB } from "./videos/l01/Thumbs";
import { total as l01Frames } from "./videos/l01/timeline";
import { L02 } from "./videos/l02/L02";
import { L02ThumbA, L02ThumbB } from "./videos/l02/Thumbs";
import { total as l02Frames } from "./videos/l02/timeline";
import { L03 } from "./videos/l03/L03";
import { L03ThumbA, L03ThumbB } from "./videos/l03/Thumbs";
import { total as l03Frames } from "./videos/l03/timeline";
import { L04 } from "./videos/l04/L04";
import { L04ThumbA, L04ThumbB } from "./videos/l04/Thumbs";
import { total as l04Frames } from "./videos/l04/timeline";
import { L05 } from "./videos/l05/L05";
import { L05ThumbA, L05ThumbB } from "./videos/l05/Thumbs";
import { total as l05Frames } from "./videos/l05/timeline";
import { L06 } from "./videos/l06/L06";
import { L06ThumbA, L06ThumbB } from "./videos/l06/Thumbs";
import { total as l06Frames } from "./videos/l06/timeline";
import { S01, S01_FRAMES, S02, S02_FRAMES, S03, S03_FRAMES, S04, S04_FRAMES, S05, S05_FRAMES, S06, S06_FRAMES, S07, S07_FRAMES, S08, S08_FRAMES, S09, S09_FRAMES, S10, S10_FRAMES, S11, S11_FRAMES, S12, S12_FRAMES, S13, S13_FRAMES, S14, S14_FRAMES } from "./videos/shorts";

export const Root: React.FC = () => (
  <>
    <Composition id="L01" component={L01} durationInFrames={l01Frames} fps={FPS} width={1920} height={1080} />
    <Composition id="L01ThumbA" component={L01ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L01ThumbB" component={L01ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L02" component={L02} durationInFrames={l02Frames} fps={FPS} width={1920} height={1080} />
    <Composition id="L02ThumbA" component={L02ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L02ThumbB" component={L02ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L03" component={L03} durationInFrames={l03Frames} fps={FPS} width={1920} height={1080} />
    <Composition id="L03ThumbA" component={L03ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L03ThumbB" component={L03ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L04" component={L04} durationInFrames={l04Frames} fps={FPS} width={1920} height={1080} />
    <Composition id="L04ThumbA" component={L04ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L04ThumbB" component={L04ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L05" component={L05} durationInFrames={l05Frames} fps={FPS} width={1920} height={1080} />
    <Composition id="L05ThumbA" component={L05ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L05ThumbB" component={L05ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L06" component={L06} durationInFrames={l06Frames} fps={FPS} width={1920} height={1080} />
    <Composition id="L06ThumbA" component={L06ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="L06ThumbB" component={L06ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="S01" component={S01} durationInFrames={S01_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S02" component={S02} durationInFrames={S02_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S03" component={S03} durationInFrames={S03_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S04" component={S04} durationInFrames={S04_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S05" component={S05} durationInFrames={S05_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S06" component={S06} durationInFrames={S06_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S07" component={S07} durationInFrames={S07_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S08" component={S08} durationInFrames={S08_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S09" component={S09} durationInFrames={S09_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S10" component={S10} durationInFrames={S10_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S11" component={S11} durationInFrames={S11_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S12" component={S12} durationInFrames={S12_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S13" component={S13} durationInFrames={S13_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="S14" component={S14} durationInFrames={S14_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);
