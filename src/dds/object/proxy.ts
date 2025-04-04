import type { ObjectDDS } from "./ObjectDDS";
import type { Property } from "./properties/Property";

export function toProxy(dds: ObjectDDS)
{
  const kernel = dds._kernel;
  const propertyMap = new Map<string, Property>();

  for (const p of kernel.properties)
    propertyMap.set(p.key, p);

  return new Proxy(dds, {
    set(target: ObjectDDS, p: string | symbol, newValue: any, receiver: any): boolean
    {
      if (target.isAttached)
      {
        const property = propertyMap.get(p as string);

        if (property !== undefined)
        {
          kernel.setValue(property, newValue);

          return true;
        }
      }

      return Reflect.set(target, p, newValue, receiver);
    },
  });
}
