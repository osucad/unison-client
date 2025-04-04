import type { Logger } from "tslog";
import type { DeltaChannel } from "../runtime/DeltaChannel.ts";
import type { UnisonRuntime } from "../runtime/UnisonRuntime.ts";
import type { IUnisonDecoder, IUnisonEncoder } from "../serialization/types";
import type { DDSAttributes } from "./DDSAttributes";
import { EventEmitter } from "eventemitter3";
import { createDDSLogger } from "../logger";

export interface DDSEvents
{
  attached: (dds: DDS) => void;
  localOp: (dds: DDS, op: unknown) => void;
}

export type DDSEventsBase = DDSEvents & EventEmitter.ValidEventTypes;

export abstract class DDS<TEvents extends DDSEventsBase = any> extends EventEmitter<TEvents>
{
  public readonly logger: Logger<any>;

  protected constructor(
    public readonly attributes: DDSAttributes,
    public id: string | null = null,
  )
  {
    super();
    this._hasStaticId = id !== null;

    this.logger = createDDSLogger(this);
  }

  private readonly _hasStaticId: boolean;

  public get isAttached(): boolean
  {
    return !!this._runtime;
  }

  /** @internal */
  public get hasStaticId(): boolean
  {
    return this._hasStaticId;
  }

  // #region Lifecycle

  protected _runtime: UnisonRuntime | null = null;
  protected _deltas: DeltaChannel | null = null;

  protected get encoder()
  {
    return this._runtime?.encoder;
  }

  public attach(runtime: UnisonRuntime, deltas: DeltaChannel): void
  {
    this._runtime = runtime;
    this._deltas = deltas;

    this.connectDeltaChannel(deltas);

    this.logger.debug("attached dds");
  }

  public detach()
  {
    this._runtime = null;
    this._deltas = null;

    this.logger.debug("detached dds");
  }

  protected abstract connectDeltaChannel(deltas: DeltaChannel): void;
  // #endregion

  // #region Serialization
  public abstract createSummary(encoder: IUnisonEncoder): unknown;

  public abstract load(content: unknown, decoder: IUnisonDecoder): void;
  // #endregion

  protected submitLocalOp(op: unknown, undoOp: unknown)
  {
    this._deltas?.submitLocalOp(op, undoOp);
  }
}
