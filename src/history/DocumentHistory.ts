import type { DDS } from "../dds/DDS.ts";
import type { UnisonRuntime } from "../runtime/UnisonRuntime.ts";
import type { IHistoryEntry } from "./IHistoryEntry.ts";
import { EventEmitter } from "eventemitter3";
import { unisonLogger } from "../logger";
import { nn } from "../utils/nn.ts";
import { pluralize } from "../utils/pluralize";
import { TransactionBuilder } from "./TransactionBuilder.ts";

export interface HistoryEvents
{
  commit: (transaction: TransactionBuilder) => void;

  undo: () => void;
  redo: () => void;
  beforeUndo: () => void;
  beforeRedo: () => void;
}

export class DocumentHistory extends EventEmitter<HistoryEvents>
{
  private readonly _runtime: UnisonRuntime;

  private readonly _logger = unisonLogger.getSubLogger({
    name: "history",
  });

  private _currentTransaction = new TransactionBuilder();

  private _undoStack: IHistoryEntry[][] = [];
  private _redoStack: IHistoryEntry[][] = [];

  private _isUndoing = false;

  public constructor(runtime: UnisonRuntime)
  {
    super();
    this._runtime = runtime;

    runtime.on("localOp", this._opSubmitted, this);
  }

  public get canUndo()
  {
    return this._undoStack.length > 0;
  }

  public get canRedo()
  {
    return this._redoStack.length > 0;
  }

  public commit(): boolean
  {
    if (this._currentTransaction.isEmpty)
      return false;

    this.emit("commit", this._currentTransaction);

    const opCount = this._currentTransaction.entries.length;

    this._undoStack.push(this._currentTransaction.entries);
    this._currentTransaction = new TransactionBuilder();

    this._logger.debug(opCount, `${pluralize(opCount, "change", "changes")} committed`);

    return true;
  }

  public undo(): boolean
  {
    this.commit();

    if (this._undoStack.length === 0)
      return false;

    this.emit("beforeUndo");

    const transaction = this._undoStack.pop()!;

    this._logger.debug(`undoing transactions with`, transaction.length, pluralize(transaction.length, "change", "changes"));

    this._isUndoing = true;

    for (const entry of transaction)
      this._applyOp(entry.id, entry.undoOp);

    this._isUndoing = false;

    if (!this._currentTransaction.isEmpty)
    {
      this._redoStack.push(this._currentTransaction.entries);
      this._currentTransaction = new TransactionBuilder();
    }

    this.emit("undo");

    return true;
  }

  public redo(): boolean
  {
    this.commit();

    if (this._redoStack.length === 0)
      return false;

    this._isUndoing = true;

    this.emit("beforeRedo");

    const transaction = this._redoStack.pop()!;

    this._logger.debug(`redoing transactions with`, transaction.length, pluralize(transaction.length, "change", "changes"));

    for (const entry of transaction)
      this._applyOp(entry.id, entry.undoOp);

    this._isUndoing = false;

    if (!this._currentTransaction.isEmpty)
    {
      this._undoStack.push(this._currentTransaction.entries);
      this._currentTransaction = new TransactionBuilder();
    }

    this.emit("redo");

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
    {
      this._logger.debug("clearing redo stack on op submitted by", dds.attributes.type, `[${dds.id}]`);
      this._redoStack = [];
    }
  }
}
