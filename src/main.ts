import { Beatmap } from "./beatmap/Beatmap";
import { BeatmapDifficulty } from "./beatmap/BeatmapDifficulty.ts";
import { BeatmapMetadata } from "./beatmap/BeatmapMetadata";
import { UnisonRuntime } from "./runtime/UnisonRuntime.ts";

const runtime = new UnisonRuntime({
  entryPoint: new Beatmap(),
  ddsTypes: [
    Beatmap,
    BeatmapDifficulty,
    BeatmapMetadata,
  ],
});

const beatmap = runtime.entryPoint;

beatmap.difficulty.approachRate = 11;

runtime.history.commit();
runtime.history.undo();

console.log(beatmap.difficulty.approachRate);

beatmap.difficulty.approachRate = 9;

runtime.history.redo();

console.log(beatmap.difficulty.approachRate);
