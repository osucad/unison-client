import type { DDSAttributes } from "../dds/DDSAttributes";
import { property } from "../dds/object/decorator";
import { ObjectDDS } from "../dds/object/ObjectDDS";

export class HitObject extends ObjectDDS
{
  public static readonly attributes: DDSAttributes = {
    type: "@osucad/hitobject",
  };

  public constructor()
  {
    super(HitObject.attributes);
  }

  @property.float()
  public startTime = 0;
}
