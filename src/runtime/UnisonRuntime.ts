import type { DDS } from "../dds/DDS";
import type { DDSFactory } from "../dds/DDSFactory";
import type { IObjectResolver } from "../serialization/IObjectResolver";

export interface UnisonRuntimeOptions
{
  readonly types: readonly DDSFactory[];
}

export class UnisonRuntime implements IObjectResolver
{
  public constructor(options: UnisonRuntimeOptions)
  {
  }

  public getObject(id: string): DDS | null
  {
    return null;
  }
}
