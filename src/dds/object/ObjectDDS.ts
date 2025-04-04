import type { DeltaChannel } from "../../runtime/DeltaChannel.ts";
import type { UnisonRuntime } from "../../runtime/UnisonRuntime.ts";
import type { IUnisonDecoder, IUnisonEncoder } from "../../serialization/types";
import type { DDSEvents } from "../DDS";
import type { DDSAttributes } from "../DDSAttributes";
import { DDS } from "../DDS";
import { ObjectDDSKernel } from "./ObjectDDSKernel";
import { objectHistoryHandler } from "./objectHistoryHandler";
import { toProxy } from "./proxy.ts";

export type ObjectDDSSummary = Record<string, unknown>;

export interface ObjectDDSEvents extends DDSEvents
{
  propertyChanged: (key: string, newValue: unknown, previousValue: unknown) => void;
}

export abstract class ObjectDDS extends DDS<ObjectDDSEvents>
{
  /** @internal */
  public readonly _kernel: ObjectDDSKernel;

  protected constructor(attributes: DDSAttributes, id: string | null = null)
  {
    super(attributes, id);

    this._kernel = new ObjectDDSKernel(this);

    return toProxy(this);
  }

  public override attach(runtime: UnisonRuntime, deltas: DeltaChannel)
  {
    super.attach(runtime, deltas);
    this._kernel.attach(runtime, deltas);
  }

  protected override connectDeltaChannel(deltas: DeltaChannel)
  {
  }

  public createSummary(encoder: IUnisonEncoder): unknown
  {
    return this._kernel.createSummary(encoder);
  }

  public load(content: unknown, decoder: IUnisonDecoder): void
  {
    this._kernel.load(content as ObjectDDSSummary, decoder);
  }

  public override readonly deltaMergeHandler = objectHistoryHandler;
}
