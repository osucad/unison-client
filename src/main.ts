import { Beatmap } from "./beatmap/Beatmap";
import { BeatmapDifficulty } from "./beatmap/BeatmapDifficulty.ts";
import { BeatmapMetadata } from "./beatmap/BeatmapMetadata";
import { HitObject } from "./beatmap/HitObject";
import { HitObjects } from "./beatmap/HitObjects";
import { UnisonRuntime } from "./runtime/UnisonRuntime.ts";
import { UnisonEncoder } from "./serialization/UnisonEncoder";

const runtime = new UnisonRuntime({
  entryPoint: new Beatmap(),
  ddsTypes: [
    Beatmap,
    BeatmapDifficulty,
    BeatmapMetadata,
    HitObjects,
    HitObject,
  ],
});

const beatmap = runtime.entryPoint;

beatmap.difficulty.approachRate = 9;
beatmap.difficulty.approachRate = 10;
beatmap.difficulty.overallDifficulty = 3;
console.log(beatmap.difficulty.createSummary(new UnisonEncoder()));

runtime.history.undo();
console.log(beatmap.difficulty.createSummary(new UnisonEncoder()));

runtime.history.redo();
console.log(beatmap.difficulty.createSummary(new UnisonEncoder()));
