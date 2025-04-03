import type { DDS } from "./DDS";
import type { DDSAttributes } from "./DDSAttributes.ts";

export interface DDSFactory<out T extends DDS = DDS>
{
  readonly attributes: DDSAttributes;

  createInstance(): T;
}

export type DDSClass<T> = (new () => T) & {
  readonly attributes: DDSAttributes;
};

export class DDSClassFactory<T extends DDS> implements DDSFactory<T>
{
  public constructor(private readonly ddsClass: DDSClass<T>)
  {
  }

  public get attributes()
  {
    return this.ddsClass.attributes;
  }

  public createInstance(): T
  {
    // eslint-disable-next-line new-cap
    return new (this.ddsClass)();
  }
}
