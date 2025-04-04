import type { IHistoryEntry } from "./IHistoryEntry.ts";

export class TransactionBuilder
{
  public readonly entries: IHistoryEntry[] = [];

  private readonly entryMap = new Map<string, IHistoryEntry[]>();

  public addEntry(entry: IHistoryEntry)
  {
    this.entries.unshift(entry);
    if (entry.key)
    {
      const values = this.entryMap.get(entry.key);

      if (values)
        values.push(entry);
      else
        this.entryMap.set(entry.key, [entry]);
    }
  }

  public get isEmpty()
  {
    return this.entries.length === 0;
  }

  public getEntries(key: string)
  {
    return this.entryMap.get(key);
  }
}
