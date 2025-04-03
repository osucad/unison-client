import type { PropertyOptions } from "./Property";
import { Property } from "./Property";

export interface StringPropertyOptions extends PropertyOptions<number>
{
  maxLength?: number;
  trim?: boolean;
}

export class StringProperty extends Property<string>
{
  public constructor(key: string, options: StringPropertyOptions)
  {
    super(key, options);

    this.maxLength = options.maxLength;
    this.trim = options.trim ?? false;
  }

  public readonly maxLength?: number;
  public readonly trim: boolean;

  public override restrictValue(value: string): string
  {
    if (this.trim)
      value = value.trim();

    if (this.maxLength !== undefined && value.length > this.maxLength)
      value = value.substring(0, this.maxLength);

    return value;
  }
}
