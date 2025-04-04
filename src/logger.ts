import type { IMeta } from "tslog";
import type { DDS } from "./dds/DDS";
import { Logger } from "tslog";

export const unisonLogger = new Logger({
  name: "unison",
  prettyLogTemplate: "{{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t{{nameWithDelimiterPrefix}}\t",
  minLevel: 2,
});

export function createDDSLogger(dds: DDS)
{
  return unisonLogger.getSubLogger({
    name: dds.attributes.type,
    prettyLogTemplate: "{{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t{{nameWithDelimiterPrefix}} {{ddsId}}\t",
    overwrite: {
      addPlaceholders(logObjMeta: IMeta, placeholderValues: Record<string, string | number>): void
      {
        placeholderValues.ddsId = dds.id ? `[${dds.id}]` : "";
      },
    },
  });
}
