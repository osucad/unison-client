import type { DDS } from "../dds/DDS.ts";
import type { UnisonRuntime } from "../runtime/UnisonRuntime.ts";
import type { IHistoryEntry } from "./IHistoryEntry.ts";
import { nn } from "../utils/nn.ts";
import { TransactionBuilder } from "./TransactionBuilder.ts";

export class HistoryManager
{
  private readonly _runtime: UnisonRuntime;

  private _currentTransaction = new TransactionBuilder();

  private _undoStack: IHistoryEntry[][] = [];
  private _redoStack: IHistoryEntry[][] = [];

  private _isUndoing = false;

  private _mode: "default" | "undoing" | "redoing" = "default";

  public constructor(runtime: UnisonRuntime)
  {
    this._runtime = runtime;

    runtime.on("localOp", this._opSubmitted, this);
  }

  public commit(): boolean
  {
    if (this._currentTransaction.isEmpty)
      return false;

    this._undoStack.push(this._currentTransaction.entries);
    this._currentTransaction = new TransactionBuilder();

    return true;
  }

  public undo(): boolean
  {
    this.commit();

    if (this._undoStack.length === 0)
      return false;

    const transaction = this._undoStack.pop()!;

    this._isUndoing = true;

    for (const entry of transaction)
      this._applyOp(entry.id, entry.undoOp);

    this._isUndoing = false;

    if (!this._currentTransaction.isEmpty)
    {
      this._redoStack.push(this._currentTransaction.entries);
      this._currentTransaction = new TransactionBuilder();
    }

    return true;
  }

  public redo(): boolean
  {
    this.commit();

    if (this._redoStack.length === 0)
      return false;

    this._isUndoing = true;

    const transaction = this._redoStack.pop()!;

    for (const entry of transaction)
      this._applyOp(entry.id, entry.undoOp);

    this._isUndoing = false;

    if (!this._currentTransaction.isEmpty)
    {
      this._undoStack.push(this._currentTransaction.entries);
      this._currentTransaction = new TransactionBuilder();
    }

    return true;
  }

  private _applyOp(id: string, op: unknown)
  {
    this._runtime.getChannel(id)?.replayOp(op);
  }

  private _opSubmitted(dds: DDS, _: unknown, undoOp: unknown)
  {
    this._currentTransaction.addEntry(nn(dds.id), undoOp);

    if (!this._isUndoing && this._redoStack.length > 0)
      this._redoStack = [];
  }
}
