import type { DeltaChannel } from "../../runtime/DeltaChannel";
import type { UnisonRuntime } from "../../runtime/UnisonRuntime";
import type { EncodedHandle, IUnisonDecoder, IUnisonEncoder } from "../../serialization/types";
import type { DDSEvents } from "../DDS";
import type { DDSAttributes } from "../DDSAttributes";
import type { ObjectDDS } from "../object/ObjectDDS";
import { encodeHandle } from "../../serialization/UnisonEncoder";
import { DDS } from "../DDS";

export interface SetSummary
{
  values: readonly EncodedHandle[];
}

export type SetMessage = SetAddMessage | SetRemoveMessage;

export interface SetAddMessage
{
  op: "add";
  values: readonly EncodedHandle[];
}

export interface SetRemoveMessage
{
  op: "remove";
  values: readonly EncodedHandle[];
}

export interface SetDDSEvents extends DDSEvents
{
  added: (dds: DDS) => void;
  removed: (dds: DDS) => void;
}

export class SetDDS<T extends ObjectDDS> extends DDS<SetDDSEvents>
{
  private readonly _values = new Set<DDS>();
  private readonly _idMap = new Map<string, T>();

  public values()
  {
    return this._values.values();
  }

  public get length()
  {
    return this._values.size;
  }

  public [Symbol.iterator]()
  {
    return this._values[Symbol.iterator]();
  }

  public constructor(attributes: DDSAttributes, id: string | null = null)
  {
    super(attributes, id);
  }

  protected connectDeltaChannel(deltas: DeltaChannel): void
  {
    deltas.setHandler(this);
  }

  public createSummary(encoder: IUnisonEncoder): SetSummary
  {
    return {
      values: [...this._idMap.values()].map(dds => encoder.encodeHandle(dds)),
    };
  }

  public load(summary: SetSummary, decoder: IUnisonDecoder): void
  {
    for (const handle of summary.values)
    {
      const obj = decoder.decodeHandle(handle) as T;

      if (!this._add(obj))
        throw new Error(`Found duplicate id ${obj.id!} when loading from summary`);
    }
  }

  public override attach(runtime: UnisonRuntime, deltas: DeltaChannel)
  {
    super.attach(runtime, deltas);

    for (const dds of this.values())
    {
      runtime.ensureAttached(dds);
    }
  }

  public add(obj: T)
  {
    if (!this._add(obj))
      return false;

    if (!this.isAttached)
      return true;

    const op: SetAddMessage = {
      op: "add",
      values: [this.encoder!.encodeHandle(obj)],
    };

    const undoOp: SetRemoveMessage = {
      op: "remove",
      values: [this.encoder!.encodeHandle(obj)],
    };

    this.submitLocalOp(op, undoOp);

    return true;
  }

  public remove(obj: T)
  {
    if (!this._remove(obj))
      return false;

    if (!this.isAttached)
      return true;
    const op: SetRemoveMessage = {
      op: "remove",
      values: [encodeHandle(obj)],
    };

    const undoOp: SetAddMessage = {
      op: "add",
      values: [encodeHandle(obj)],
    };

    this.submitLocalOp(op, undoOp);

    return true;
  }

  private _add(dds: T): boolean
  {
    if (this._values.has(dds))
      return false;

    this._runtime?.ensureAttached(dds);

    if (dds.id)
    {
      if (this._idMap.has(dds.id))
        return false;

      this._idMap.set(dds.id, dds);
    }

    this._values.add(dds);

    this.emit("added", dds);

    return true;
  }

  private _remove(dds: DDS): boolean
  {
    if (!this._values.has(dds))
      return false;

    this._values.delete(dds);

    if (dds.id)
      this._idMap.delete(dds.id);

    this.emit("removed", dds);

    return true;
  }

  public replayOp(message: unknown): void
  {
    const msg = message as SetMessage;

    switch (msg.op)
    {
      case "add":
        for (const handle of msg.values)
        {
          const obj = this._runtime!.getObject(handle[1]);
          if (!obj)
            continue;

          this.add(obj as T);
        }

        break;
      case "remove":

        for (const handle of msg.values)
        {
          const obj = this._idMap.get(handle[1]);
          if (!obj)
            continue;

          this.remove(obj as T);
        }

        break;
    }
  }
}
