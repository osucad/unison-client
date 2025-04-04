import type { DDS } from "../dds/DDS.ts";
import type { ILocalOpEvent } from "./ILocalOpEvent";
import type { UnisonRuntime } from "./UnisonRuntime.ts";

export interface IDeltaHandler
{
  replayOp(message: unknown): void;
}

export class DeltaChannel
{
  public constructor(
    private readonly runtime: UnisonRuntime,
    public readonly dds: DDS,
  )
  {
  }

  private _handler?: IDeltaHandler;

  public setHandler(handler: IDeltaHandler)
  {
    this._handler = handler;
  }

  public submitLocalOp(event: ILocalOpEvent)
  {
    this.runtime.opSubmitted(this.dds, event);
  }

  public replayOp(op: unknown)
  {
    this._handler!.replayOp(op);
  }
}
