import type { IHistoryEntry } from "./IHistoryEntry.ts";

export class TransactionBuilder
{
  public readonly entries: IHistoryEntry[] = [];

  public addEntry(id: string, undoOp: unknown)
  {
    this.entries.unshift({ id, undoOp });
  }

  public get isEmpty()
  {
    return this.entries.length === 0;
  }
}
