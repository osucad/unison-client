import type { DDS } from "../dds/DDS";

export interface IObjectResolver
{
  getObject(id: string): DDS | null;
}
