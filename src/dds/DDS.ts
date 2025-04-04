import type { DeltaChannel } from "../runtime/DeltaChannel.ts";
import type { UnisonRuntime } from "../runtime/UnisonRuntime.ts";
import type { IUnisonDecoder, IUnisonEncoder } from "../serialization/types";
import type { DDSAttributes } from "./DDSAttributes";
import { EventEmitter } from "eventemitter3";

export interface DDSEvents
{
  attached: (dds: DDS) => void;
  localOp: (dds: DDS, op: unknown) => void;
}

export type DDSEventsBase = DDSEvents & EventEmitter.ValidEventTypes;

export abstract class DDS<TEvents extends DDSEventsBase = any> extends EventEmitter<TEvents>
{
  protected constructor(
    public readonly attributes: DDSAttributes,
    public id: string | null = null,
  )
  {
    super();
    this._hasStaticId = id !== null;
  }

  private _runtime: UnisonRuntime | null = null;
  private _deltas: DeltaChannel | null = null;

  private readonly _hasStaticId: boolean;

  /** @internal */
  public get hasStaticId(): boolean
  {
    return this._hasStaticId;
  }

  public attach(runtime: UnisonRuntime, deltas: DeltaChannel): void
  {
    this._runtime = runtime;
    this._deltas = deltas;
  }

  protected abstract connectDeltaChannel(deltas: DeltaChannel): void;

  // region serialization
  public abstract createSummary(encoder: IUnisonEncoder): unknown;

  public abstract load(content: unknown, decoder: IUnisonDecoder): void;

  // endregion
}
