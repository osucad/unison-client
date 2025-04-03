import type { DDS } from "./DDS";

export interface DDSFactory<out T extends DDS = DDS>
{
  readonly type: string;

  createInstance(): T;
}
