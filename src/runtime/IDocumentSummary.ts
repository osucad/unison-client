import type { IObjectSummary } from "../dds/IObjectSummary.ts";

export interface IDocumentSummary
{
  readonly entryPoint: string;
  readonly entries: Record<string, IObjectSummary>;
}
