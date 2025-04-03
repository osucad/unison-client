import type { DDSAttributes } from "./DDSAttributes";

export interface IObjectSummary
{
  readonly attributes: DDSAttributes;
  readonly content: unknown;
}
