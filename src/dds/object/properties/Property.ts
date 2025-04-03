import type { IUnisonDecoder, IUnisonEncoder } from "../../../serialization/types";

export interface PropertyOptions<T>
{
}

export class Property<T = any>
{
  public constructor(public readonly key: string, options: PropertyOptions<T>)
  {
  }

  public restrictValue(value: T): T
  {
    return value;
  }

  public encode(value: T, encoder: IUnisonEncoder): unknown;
  public encode(value: any, encoder: IUnisonEncoder): unknown
  {
    return value;
  }

  public decode(value: unknown, decoder: IUnisonDecoder): T
  {
    return value as T;
  }
}
