export interface IHistoryEntry
{
  readonly target: string;
  readonly undoOp: unknown;
  readonly key?: string;
}
