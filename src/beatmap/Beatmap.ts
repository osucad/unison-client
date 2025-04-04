import type { DDSAttributes } from "../dds/DDSAttributes";
import { property } from "../dds/object/decorator";
import { ObjectDDS } from "../dds/object/ObjectDDS";
import { BeatmapDifficulty } from "./BeatmapDifficulty";
import { BeatmapMetadata } from "./BeatmapMetadata";
import { HitObjects } from "./HitObjects";

export class Beatmap extends ObjectDDS
{
  public static readonly attributes: DDSAttributes = {
    type: "@osucad/beatmap",
  };

  public constructor()
  {
    super(Beatmap.attributes, "/beatmap");
  }

  @property.dds(() => BeatmapMetadata, { readonly: true })
  public metadata = new BeatmapMetadata();

  @property.dds(() => BeatmapDifficulty, { readonly: true })
  public difficulty = new BeatmapDifficulty();

  @property.dds(() => HitObjects)
  public hitObjects = new HitObjects();
}
