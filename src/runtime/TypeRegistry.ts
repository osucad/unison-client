import type { DDS } from "../dds/DDS.ts";
import type { DDSClass, DDSFactory } from "../dds/DDSFactory";
import { DDSClassFactory } from "../dds/DDSFactory";

export type DDSFactoryOrClass<T extends DDS = DDS> =
  | DDSFactory<T>
  | DDSClass<T>;

export class DDSFactoryRegistry
{
  public readonly types = new Map<string, DDSFactory>();

  public constructor(types: readonly DDSFactoryOrClass[])
  {
    for (const t of types)
    {
      if (typeof t === "function")
        this.register(new DDSClassFactory(t));
      else
        this.register(t);
    }
  }

  public register(factory: DDSFactory)
  {
    if (this.types.has(factory.attributes.type))
      throw new Error(`Duplicate entry for DDS type "${factory.attributes.type}"`);

    this.types.set(factory.attributes.type, factory);
  }

  public getFactory(type: string): DDSFactory | null
  {
    return this.types.get(type) ?? null;
  }
}
