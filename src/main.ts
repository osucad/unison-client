import { Beatmap } from "./beatmap/Beatmap";
import { BeatmapDifficulty } from "./beatmap/BeatmapDifficulty.ts";
import { hydrateRuntime } from "./runtime/hydrate.ts";
import { UnisonRuntime } from "./runtime/UnisonRuntime.ts";
import { UnisonEncoder } from "./serialization/UnisonEncoder.ts";

const runtime = new UnisonRuntime({
  entryPoint: new Beatmap(),
  ddsTypes: [
    Beatmap,
    BeatmapDifficulty,
  ],
});

const beatmap = runtime.entryPoint;

beatmap.difficulty.approachRate = 9.22;

const summary = runtime.createSummary();

console.log(summary);

const runtime2 = hydrateRuntime(summary, [
  Beatmap,
  BeatmapDifficulty,
]) as UnisonRuntime<Beatmap>;

console.log(runtime2.entryPoint.difficulty.createSummary(new UnisonEncoder()));
