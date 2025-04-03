import type { PropertyOptions } from "./Property";
import { Property } from "./Property";

export interface FloatPropertyOptions extends PropertyOptions<number>
{
  min?: number;
  max?: number;
  precision?: number;
}

export class FloatProperty extends Property<number>
{
  public constructor(key: string, options: FloatPropertyOptions)
  {
    super(key, options);

    this.min = options.min;
    this.max = options.max;
    this.precision = options.precision;
  }

  public readonly min?: number;
  public readonly max?: number;
  public readonly precision?: number;

  public override restrictValue(value: number): number
  {
    if (this.min !== undefined && value < this.min)
      value = this.min;

    if (this.max !== undefined && value > this.max)
      value = this.max;

    if (this.precision !== undefined)
      value = Number.parseFloat(value.toPrecision(this.precision));

    return value;
  }
}
