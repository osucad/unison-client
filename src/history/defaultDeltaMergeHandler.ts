import type { ILocalOpEvent } from "../runtime/ILocalOpEvent";
import type { IDeltaMergeHandler } from "./IDeltaMergeHandler";
import type { TransactionBuilder } from "./TransactionBuilder";
import { nn } from "../utils/nn";

export const defaultDeltaMergeHandler: IDeltaMergeHandler = {
  addToTransaction(transaction: TransactionBuilder, target, event: ILocalOpEvent)
  {
    transaction.addEntry({
      target: nn(target.id),
      undoOp: event.undoOp,
    });
  },
};
