import { Beatmap } from "./beatmap/Beatmap";
import { BeatmapDifficulty } from "./beatmap/BeatmapDifficulty.ts";
import { BeatmapMetadata } from "./beatmap/BeatmapMetadata";
import { HitObject } from "./beatmap/HitObject";
import { HitObjects } from "./beatmap/HitObjects";
import { UnisonRuntime } from "./runtime/UnisonRuntime.ts";

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

expect(beatmap.hitObjects.length).toBe(0);

beatmap.hitObjects.add(new HitObject());

expect(beatmap.hitObjects.length).toBe(1);

runtime.history.undo();

expect(beatmap.hitObjects.length).toBe(0);
