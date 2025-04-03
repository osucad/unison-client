import type { EncodedHandle, IUnisonDecoder, IUnisonEncoder } from "../../../serialization/types";
import type { DDS } from "../../DDS";
import type { PropertyOptions } from "./Property";
import { Property } from "./Property";

export type DDSClass = abstract new (...args: any[]) => DDS;

export interface DDSPropertyOptions extends PropertyOptions<DDS>
{
  type: () => DDSClass;
}

export class DDSProperty extends Property<DDS>
{
  public constructor(key: string, options: DDSPropertyOptions)
  {
    super(key, options);

    this.type = options.type;
  }

  public readonly type: () => DDSClass;

  public override restrictValue(value: DDS): DDS
  {
    if (!(value instanceof this.type()))
      throw new Error(`Expected value of type ${this.type()}, but got ${value} instead`);

    return super.restrictValue(value);
  }

  public override encode(value: DDS, encoder: IUnisonEncoder): unknown
  {
    value = encoder.encodeHandle(value) as any;

    return super.encode(value, encoder);
  }

  public override decode(value: unknown, decoder: IUnisonDecoder): DDS
  {
    value = super.decode(value, decoder);

    return decoder.decodeHandle(value as EncodedHandle);
  }
}
