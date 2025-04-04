import type { IDeltaMergeHandler } from "../../history/IDeltaMergeHandler";
import type { TransactionBuilder } from "../../history/TransactionBuilder";
import type { ILocalOpEvent } from "../../runtime/ILocalOpEvent";
import type { DDS } from "../DDS";
import type { IObjectMessage } from "./ObjectDDSKernel";
import { nn } from "../../utils/nn";

export const objectHistoryHandler: IDeltaMergeHandler = {
  addToTransaction(transaction: TransactionBuilder, dds: DDS, event: ILocalOpEvent)
  {
    const id = nn(dds.id);

    const key = `object:${id}`;

    const entries = transaction.getEntries(key);

    if (entries?.length !== 1)
    {
      transaction.addEntry({
        target: id,
        undoOp: event.undoOp,
        key,
      });
    }
    else
    {
      const existing = entries[0].undoOp as IObjectMessage;
      const undoOp = event.undoOp as IObjectMessage;

      for (const key in undoOp)
      {
        if (key in existing)
          continue;

        existing[key] = undoOp[key];
      }
    }
  },
};
