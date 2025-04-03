import type { DDSAttributes } from "../dds/DDSAttributes";
import type { EncodedHandle, IUnisonDecoder, IUnisonEncoder } from "../serialization/types";
import { DDS } from "../dds/DDS";
import { BeatmapDifficulty } from "./BeatmapDifficulty";

export interface IBeatmapSummary
{
  readonly difficulty: EncodedHandle;
}

export class Beatmap extends DDS
{
  public static readonly attributes: DDSAttributes = {
    type: "beatmap",
  };

  public constructor()
  {
    super(Beatmap.attributes, "/");
  }

  public difficulty = new BeatmapDifficulty();

  public load(content: unknown, decoder: IUnisonDecoder)
  {
    const summary = content as IBeatmapSummary;

    this.difficulty = decoder.decodeHandle(summary.difficulty) as BeatmapDifficulty;
  }

  public createSummary(encoder: IUnisonEncoder): IBeatmapSummary
  {
    return {
      difficulty: encoder.encodeHandle(this.difficulty),
    };
  }
}
