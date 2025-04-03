import type { IUnisonDecoder, IUnisonEncoder } from "../../serialization/types";
import type { ObjectDDS, ObjectDDSSummary } from "./ObjectDDS";
import type { Property } from "./properties/Property";
import { getPropertyMetadata } from "./decorator";

export class ObjectDDSKernel
{
  public readonly properties: readonly Property[];

  public constructor(public readonly target: ObjectDDS)
  {
    this.properties = getPropertyMetadata(target);
  }

  public createSummary(encoder: IUnisonEncoder): ObjectDDSSummary
  {
    const summary: ObjectDDSSummary = {};

    const { target, properties } = this;

    for (const p of properties)
    {
      const value: unknown = Reflect.get(target, p.key);

      summary[p.key] = p.encode(value, encoder);
    }

    return summary;
  }

  public load(summary: ObjectDDSSummary, decoder: IUnisonDecoder): void
  {
    const { target, properties } = this;

    for (const p of properties)
    {
      let value = summary[p.key];

      value = p.decode(value, decoder);

      Reflect.set(target, p.key, value);
    }
  }

  public setValue(property: Property, newValue: unknown)
  {
    if (property.readonly)
      throw new Error(`${property.key} is readonly`);

    this._setValue(property, newValue);
  }

  private _setValue(property: Property, newValue: unknown)
  {
    Reflect.set(this.target, property.key, newValue);
  }
}
