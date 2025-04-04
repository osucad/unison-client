import type { EncodedHandle, EncodedPlainValue, EncodedValue, IUnisonEncoder } from "./types";
import { DDS } from "../dds/DDS";
import { nn } from "../utils/nn";
import { ValueType } from "./types";

export function encodePlainValue(value: unknown): EncodedPlainValue
{
  return [ValueType.Plain, value];
}

export function encodeHandle(value: DDS): EncodedHandle
{
  return [ValueType.Handle, nn(value.id)];
}

export class UnisonEncoder implements IUnisonEncoder
{
  public onHandleEncode?: (dds: DDS) => void;

  public encode(value: unknown): EncodedValue
  {
    if (value instanceof DDS)
      return this.encodeHandle(value);

    return this.encodePlainValue(value);
  }

  protected encodePlainValue(value: unknown): EncodedPlainValue
  {
    return encodePlainValue(value);
  }

  public encodeHandle(dds: DDS): EncodedHandle
  {
    this.onHandleEncode?.(dds);

    return encodeHandle(dds);
  }
}
