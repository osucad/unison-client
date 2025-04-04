import type { DDS } from "../dds/DDS";
import type { IDocumentSummary } from "./IDocumentSummary.ts";
import type { DDSFactoryOrClass } from "./TypeRegistry.ts";
import { LocalObjectResolver } from "../serialization/LocalObjectResolver.ts";
import { UnisonDecoder } from "../serialization/UnisonDecoder.ts";
import { DDSFactoryRegistry } from "./TypeRegistry.ts";
import { UnisonRuntime } from "./UnisonRuntime.ts";

export function hydrateRuntime<T extends DDS>(
  entryPoint: T,
  summary: IDocumentSummary,
  ddsTypes: readonly DDSFactoryOrClass[],
): UnisonRuntime<T>
{
  const resolver = new LocalObjectResolver();

  const registry = new DDSFactoryRegistry(ddsTypes);

  const decoder = new UnisonDecoder(resolver);

  for (const [id, objectSummary] of Object.entries(summary.entries))
  {
    const factory = registry.getFactory(objectSummary.attributes.type);
    if (!factory)
      throw new Error(`DDS type "${objectSummary.attributes.type}" not registered`);

    let instance: DDS;

    if (id === summary.entryPoint)
    {
      if (entryPoint.attributes.type !== factory.attributes.type)
        throw new Error(`Unexpected type ${factory.attributes.type} for entrypoint`);

      instance = entryPoint;
    }
    else
    {
      instance = factory.createInstance();
    }

    resolver.add(id, instance);
  }

  for (const [id, objectSummary] of Object.entries(summary.entries))
  {
    const dds = resolver.getObject(id)!;

    dds.id = id;

    dds.load(objectSummary.content, decoder);
  }

  if (!entryPoint)
    throw new Error(`Could not find entrypoint "${summary.entryPoint}" for document`);

  return new UnisonRuntime({
    entryPoint,
    ddsTypes,
  });
}
