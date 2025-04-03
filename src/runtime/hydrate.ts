import type { IDocumentSummary } from "./IDocumentSummary.ts";
import type { DDSFactoryOrClass } from "./TypeRegistry.ts";
import { LocalObjectResolver } from "../serialization/LocalObjectResolver.ts";
import { UnisonDecoder } from "../serialization/UnisonDecoder.ts";
import { DDSFactoryRegistry } from "./TypeRegistry.ts";
import { UnisonRuntime } from "./UnisonRuntime.ts";

export function hydrateRuntime(
  summary: IDocumentSummary,
  ddsTypes: readonly DDSFactoryOrClass[],
)
{
  const resolver = new LocalObjectResolver();

  const registry = new DDSFactoryRegistry(ddsTypes);

  const decoder = new UnisonDecoder(resolver);

  for (const [id, objectSummary] of Object.entries(summary.entries))
  {
    const factory = registry.getFactory(objectSummary.attributes.type);
    if (!factory)
      throw new Error(`DDS type "${objectSummary.attributes.type}" not registered`);

    const instance = factory.createInstance();

    resolver.add(id, instance);
  }

  for (const [id, objectSummary] of Object.entries(summary.entries))
  {
    const dds = resolver.getObject(id)!;

    dds.id = id;

    dds.load(objectSummary.content, decoder);
  }

  const entryPoint = resolver.getObject(summary.entryPoint);

  if (!entryPoint)
    throw new Error(`Could not find entrypoint "${summary.entryPoint}" for document`);

  return new UnisonRuntime({
    entryPoint,
    ddsTypes,
  });
}
