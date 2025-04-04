import type { DDSAttributes } from "../dds/DDSAttributes";
import { property } from "../dds/object/decorator.ts";
import { ObjectDDS } from "../dds/object/ObjectDDS.ts";

export class BeatmapMetadata extends ObjectDDS
{
  public static readonly attributes: DDSAttributes = {
    type: "@osucad/beatmap-metadata",
  };

  public constructor()
  {
    super(BeatmapMetadata.attributes, "/metadata");
  }

  @property()
  public artist = "";

  @property()
  public artistUnicode = "";

  @property()
  public title = "";

  @property()
  public titleUnicode = "";

  @property()
  public difficultyName = "";
}
