import type { DDSAttributes } from "../dds/DDSAttributes";
import type { EncodedHandle } from "../serialization/types";
import { property } from "../dds/object/decorator";
import { ObjectDDS } from "../dds/object/ObjectDDS";
import { BeatmapDifficulty } from "./BeatmapDifficulty";

export interface IBeatmapSummary
{
  readonly difficulty: EncodedHandle;
}

export class Beatmap extends ObjectDDS
{
  public static readonly attributes: DDSAttributes = {
    type: "beatmap",
  };

  public constructor()
  {
    super(Beatmap.attributes, "/");
  }

  @property.dds(() => BeatmapDifficulty)
  public difficulty = new BeatmapDifficulty();
}
