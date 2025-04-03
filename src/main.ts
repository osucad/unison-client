import { Beatmap } from "./beatmap/Beatmap";
import { UnisonDecoder } from "./serialization/UnisonDecoder";
import { UnisonEncoder } from "./serialization/UnisonEncoder";

const beatmap = new Beatmap();

const encoder = new UnisonEncoder();

const summary = beatmap.difficulty.createSummary(encoder);

beatmap.difficulty.approachRate = 10;

beatmap.difficulty.load(summary, new UnisonDecoder());

console.log(beatmap.difficulty);
