import { Beatmap } from "./beatmap/Beatmap";
import { BeatmapDifficulty } from "./beatmap/BeatmapDifficulty.ts";
import { UnisonRuntime } from "./runtime/UnisonRuntime.ts";

const runtime = new UnisonRuntime({
  entryPoint: new Beatmap(),
  ddsTypes: [
    Beatmap,
    BeatmapDifficulty,
  ],
});

const beatmap = runtime.entryPoint;

beatmap.difficulty.approachRate = 9.2;

runtime.history.commit();
runtime.history.undo();

console.log(beatmap.difficulty.approachRate);

runtime.history.redo();

console.log(beatmap.difficulty.approachRate);
