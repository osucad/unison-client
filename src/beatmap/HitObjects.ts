import type { DDSAttributes } from "../dds/DDSAttributes";
import type { HitObject } from "./HitObject";
import { SetDDS } from "../dds/sortedSet/SetDDS";

export class HitObjects extends SetDDS<HitObject>
{
  public static readonly attributes: DDSAttributes = {
    type: "@osucad/hitobjects",
  };

  public constructor()
  {
    super(HitObjects.attributes, "/hitobjects");
  }
}
