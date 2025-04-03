import type { DDSFactory } from "../dds/DDSFactory";

export class DDSFactoryRegistry
{
  public readonly types = new Map<string, DDSFactory>();

  public constructor(types: readonly DDSFactory[])
  {
  }

  public register(factory: DDSFactory)
  {
    if (this.types.has(factory.type))
      throw new Error(`Duplicate entry for DDS type "${factory.type}"`);

    this.types.set(factory.type, factory);
  }

  public getFactory(type: string): DDSFactory | null
  {
    return this.types.get(type) ?? null;
  }
}
