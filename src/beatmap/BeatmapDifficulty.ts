import type { DDSAttributes } from "../dds/DDSAttributes";
import { property } from "../dds/object/decorator";
import { ObjectDDS } from "../dds/object/ObjectDDS";

export class BeatmapDifficulty extends ObjectDDS
{
  public static readonly attributes: DDSAttributes = {
    type: "@osucad/beatmap-difficulty",
  };

  public constructor()
  {
    super(BeatmapDifficulty.attributes, "/difficulty");
  }

  @property.float({ min: 0, max: 10, precision: 2 })
  public drainRate = 5;

  @property.float({ min: 0, max: 10, precision: 2 })
  public circleSize = 5;

  @property.float({ min: 0, max: 10, precision: 2 })
  public approachRate = 5;

  @property.float({ min: 0, max: 10, precision: 2 })
  public overallDifficulty = 5;

  @property.float({ min: 0.4, max: 3.6, precision: 2 })
  public sliderMultiplier = 1.4;

  @property.int({ min: 1, max: 4 })
  public sliderTickRateBindable = 1;
}
