import type { PropertyOptions } from "./Property";
import { Property } from "./Property";

export interface IntPropertyOptions extends PropertyOptions<number>
{
  min?: number;
  max?: number;
}

export class IntProperty extends Property<number>
{
  public constructor(key: string, options: IntPropertyOptions)
  {
    super(key, options);

    this.min = options.min;
    this.max = options.max;
  }

  public readonly min?: number;
  public readonly max?: number;

  public override restrictValue(value: number): number
  {
    if (this.min !== undefined && value < this.min)
      value = this.min;

    if (this.max !== undefined && value > this.max)
      value = this.max;

    value = Math.round(value);

    return value;
  }
}
