import type { DDS } from "../dds/DDS";
import type { IObjectResolver } from "./IObjectResolver";

export class LocalObjectResolver implements IObjectResolver
{
  private _objects = new Map<string, DDS>();

  public getObject(id: string): DDS | null
  {
    return this._objects.get(id) ?? null;
  }

  public add(id: string, dds: DDS): this
  {
    this._objects.set(id, dds);

    return this;
  }
}
