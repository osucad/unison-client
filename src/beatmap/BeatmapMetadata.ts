import { property } from "../dds/object/decorator.ts";
import { ObjectDDS } from "../dds/object/ObjectDDS.ts";

export class BeatmapMetadata extends ObjectDDS
{
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
