import type { DeltaChannel } from "../runtime/DeltaChannel.ts";
import type { UnisonRuntime } from "../runtime/UnisonRuntime.ts";
import type { IUnisonDecoder, IUnisonEncoder } from "../serialization/types";
import type { DDSAttributes } from "./DDSAttributes";

export abstract class DDS
{
  protected constructor(
    public readonly attributes: DDSAttributes,
    public id: string | null = null,
  )
  {
    this._hasStaticId = id !== null;
  }

  private _hasStaticId: boolean;

  /** @internal */
  public get hasStaticId(): boolean
  {
    return this._hasStaticId;
  }

  public abstract attach(runtime: UnisonRuntime, deltas: DeltaChannel): void;

  // region serialization
  public abstract createSummary(encoder: IUnisonEncoder): unknown;

  public abstract load(content: unknown, decoder: IUnisonDecoder): void;
  // endregion
}
