import type { DeltaChannel, IDeltaHandler } from "../../runtime/DeltaChannel.ts";
import type { UnisonRuntime } from "../../runtime/UnisonRuntime.ts";
import type { IUnisonDecoder, IUnisonEncoder } from "../../serialization/types";
import type { ObjectDDS, ObjectDDSSummary } from "./ObjectDDS";
import type { Property } from "./properties/Property";
import { UnisonDecoder } from "../../serialization/UnisonDecoder.ts";
import { UnisonEncoder } from "../../serialization/UnisonEncoder.ts";
import { getPropertyMetadata } from "./decorator";

export class ObjectDDSKernel implements IDeltaHandler
{
  public readonly properties: readonly Property[];

  private _runtime: UnisonRuntime | null = null;
  private _deltas: DeltaChannel | null = null;

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

    let previousValue = Reflect.get(this.target, property.key);

    newValue = property.restrictValue(newValue);

    if (property.equals(newValue, previousValue))
      return;

    this._setValue(property, newValue);

    if (!this._runtime)
      return;

    const encoder = new UnisonEncoder();

    newValue = property.encode(newValue, encoder);
    previousValue = property.encode(previousValue, encoder);

    const op = { [property.key]: newValue };
    const undoOp = { [property.key]: previousValue };

    this._deltas!.submitLocalOp(op, undoOp);
  }

  private _setValue(property: Property, newValue: unknown)
  {
    const previousValue = Reflect.get(this.target, property.key);

    Reflect.set(this.target, property.key, newValue);

    this.target.emit("propertyChanged", property.key, newValue, previousValue);
  }

  public attach(runtime: UnisonRuntime, deltas: DeltaChannel)
  {
    this._runtime = runtime;
    this._deltas = deltas;

    deltas.setHandler(this);
  }

  public replayOp(message: unknown)
  {
    const op = message as Record<string, unknown>;

    for (const key in op)
    {
      const property = this.properties.find(it => it.key === key);

      if (!property)
        continue;

      const value = property.decode(op[key], new UnisonDecoder());

      this.setValue(property, value);
    }
  }
}
