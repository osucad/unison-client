export interface IValueSerializer<T>
{
  encode(value: T): unknown;

  decode(value: unknown): T;
}
