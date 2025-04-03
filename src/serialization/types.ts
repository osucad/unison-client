import type { DDS } from "../dds/DDS";

export enum ValueType
{
  Plain = "plain",
  Handle = "handle",
}

export type EncodedValue = EncodedPlainValue | EncodedHandle;

export type EncodedPlainValue = [ValueType.Plain, unknown];
export type EncodedHandle = [ValueType.Handle, string];

export interface IUnisonEncoder
{
  encode(value: unknown): EncodedValue;

  encodeHandle(value: DDS): EncodedHandle;
}

export interface IUnisonDecoder
{
  decode(value: EncodedValue): unknown;

  decodeHandle(value: EncodedHandle): DDS;
}
