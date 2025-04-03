import type { IUnisonDecoder, IUnisonEncoder } from "../../serialization/types";
import type { ObjectDDS, SharedObjectSummary } from "./ObjectDDS";
import type { Property } from "./properties/Property";
import { getPropertyMetadata } from "./decorator";

export class ObjectDDSKernel
{
  public readonly properties: readonly Property[];

  public constructor(public readonly target: ObjectDDS)
  {
    this.properties = getPropertyMetadata(target);
  }

  public createSummary(encoder: IUnisonEncoder): SharedObjectSummary
  {
    const summary: SharedObjectSummary = {
      values: {},
    };

    const { target, properties } = this;

    for (const p of properties)
    {
      const value: unknown = Reflect.get(target, p.key);

      summary.values[p.key] = p.encode(value, encoder);
    }

    return summary;
  }

  public load(summary: SharedObjectSummary, decoder: IUnisonDecoder): void
  {
    const { target, properties } = this;

    for (const p of properties)
    {
      let value = summary.values[p.key];

      value = p.decode(value, decoder);

      Reflect.set(target, p.key, value);
    }
  }

  public setValue(property: Property, newValue: unknown)
  {
    if (property.readonly)
      throw new Error(`${property.key} is readonly`);

    Reflect.set(this.target, property.key, newValue);

    // TODO
  }
}
