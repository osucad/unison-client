import type { DDS } from "../dds/DDS";
import type { ILocalOpEvent } from "../runtime/ILocalOpEvent";
import type { TransactionBuilder } from "./TransactionBuilder";

export interface IDeltaMergeHandler
{
  addToTransaction(transaction: TransactionBuilder, dds: DDS, event: ILocalOpEvent): void;
}
