import type { DDS } from "../dds/DDS";
import type { IObjectResolver } from "../serialization/IObjectResolver";
import type { IDocumentSummary } from "./IDocumentSummary.ts";
import type { DDSFactoryOrClass } from "./TypeRegistry.ts";
import { UnisonEncoder } from "../serialization/UnisonEncoder.ts";
import { DDSFactoryRegistry } from "./TypeRegistry.ts";

export interface UnisonRuntimeOptions<T extends DDS>
{
  readonly entryPoint: T;
  readonly ddsTypes: readonly DDSFactoryOrClass[];
}

export class UnisonRuntime<T extends DDS> implements IObjectResolver
{
  public readonly entryPoint: T;

  private readonly _attachedObjects = new Map<string, DDS>();

  private readonly _typeRegistry: DDSFactoryRegistry;

  public constructor(options: UnisonRuntimeOptions<T>)
  {
    this.entryPoint = options.entryPoint;
    this._typeRegistry = new DDSFactoryRegistry(options.ddsTypes);

    this._attachRecursive(options.entryPoint);

    this._validate();
  }

  public getObject(id: string): DDS | null
  {
    return null;
  }

  private _attachRecursive(dds: DDS): void
  {
    const encoder = new UnisonEncoder();
    const trackedObjects = new Set<DDS>();
    const remainingObjects: DDS[] = [dds];

    encoder.onHandleEncoded = (obj) =>
    {
      if (trackedObjects.has(obj))
        return;

      trackedObjects.add(obj);
      remainingObjects.push(obj);
    };

    while (remainingObjects.length > 0)
    {
      const current = remainingObjects.shift()!;

      this._attach(current);

      current.createSummary(encoder);
    }
  }

  private _attach(dds: DDS): void
  {
    dds.id ??= crypto.randomUUID();
    this._attachedObjects.set(dds.id, dds);
  }

  private _validate()
  {
    for (const entry of [...this._attachedObjects.values()])
    {
      const factory = this._typeRegistry.getFactory(entry.attributes.type);

      if (!factory)
        throw new Error(`Could not find factory for type "${entry.attributes.type}"`);
    }
  }

  public createSummary()
  {
    const encoder = new UnisonEncoder();
    const trackedObjects = new Set<DDS>();
    const remainingObjects: DDS[] = [this.entryPoint];

    encoder.onHandleEncoded = (obj) =>
    {
      if (trackedObjects.has(obj))
        return;

      trackedObjects.add(obj);
      remainingObjects.push(obj);
    };

    const summary: IDocumentSummary = {
      entries: {},
      entryPoint: this.entryPoint.id!,
    };

    while (remainingObjects.length > 0)
    {
      const current = remainingObjects.shift()!;

      this._attach(current);

      summary.entries[current.id!] = {
        attributes: current.attributes,
        content: current.createSummary(encoder),
      };
    }

    return summary;
  }
}
