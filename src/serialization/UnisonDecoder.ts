import type { IObjectResolver } from "./IObjectResolver";
import type { EncodedHandle, EncodedPlainValue, EncodedValue, IUnisonEncoder } from "./types";
import { DDS } from "../dds/DDS";
import { nn } from "../utils/nn";
import { LocalObjectResolver } from "./LocalObjectResolver";
import { ValueType } from "./types";

export class UnisonDecoder implements IUnisonEncoder
{
  constructor(private readonly objectResolver: IObjectResolver = new LocalObjectResolver())
  {
  }

  encode(value: unknown): EncodedValue
  {
    if (value instanceof DDS)
      return this.encodeHandle(value);

    return this.encodePlainValue(value);
  }

  protected encodePlainValue(value: unknown): EncodedPlainValue
  {
    return [ValueType.Plain, value];
  }

  encodeHandle(value: DDS): EncodedHandle
  {
    return [ValueType.Handle, value.id!];
  }

  public decode(value: EncodedValue): unknown
  {
    switch (value[0])
    {
      case ValueType.Handle:
        return this.decodeHandle(value);
      case ValueType.Plain:
        return value[1];
    }
  }

  public decodeHandle(value: EncodedHandle): DDS
  {
    const id = value[1];

    const object = this.objectResolver.getObject(id);

    return nn(object, `No object found for id ${id}`);
  }
}
