import type { DDSAttributes } from "../dds/DDSAttributes";
import { property } from "../dds/object/decorator";
import { ObjectDDS } from "../dds/object/ObjectDDS";
import { BeatmapDifficulty } from "./BeatmapDifficulty";

export class Beatmap extends ObjectDDS
{
  public static readonly attributes: DDSAttributes = {
    type: "beatmap",
  };

  public constructor()
  {
    super(Beatmap.attributes, "/");
  }

  @property.dds(() => BeatmapDifficulty, { readonly: true })
  public difficulty = new BeatmapDifficulty();
}
