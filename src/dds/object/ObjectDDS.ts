import type { IUnisonDecoder, IUnisonEncoder } from "../../serialization/types";
import type { DDSAttributes } from "../DDSAttributes";
import { DDS } from "../DDS";
import { ObjectDDSKernel } from "./ObjectDDSKernel";

export interface SharedObjectSummary
{
  values: Record<string, unknown>;
}

export abstract class ObjectDDS extends DDS
{
  /** @internal */
  public readonly _kernel: ObjectDDSKernel;

  protected constructor(attributes: DDSAttributes, id: string | null = null)
  {
    super(attributes, id);

    this._kernel = new ObjectDDSKernel(this);
  }

  public createSummary(encoder: IUnisonEncoder): unknown
  {
    return this._kernel.createSummary(encoder);
  }

  public load(content: unknown, decoder: IUnisonDecoder): void
  {
    this._kernel.load(content as SharedObjectSummary, decoder);
  }
}
