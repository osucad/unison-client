import type { DDS } from "../dds/DDS";
import type { IObjectResolver } from "../serialization/IObjectResolver";
import type { IDocumentSummary } from "./IDocumentSummary.ts";
import type { ILocalOpEvent } from "./ILocalOpEvent";
import type { DDSFactoryOrClass } from "./TypeRegistry.ts";
import { EventEmitter } from "eventemitter3";
import { DocumentHistory } from "../history/DocumentHistory.ts";
import { unisonLogger } from "../logger";
import { UnisonEncoder } from "../serialization/UnisonEncoder.ts";
import { DeltaChannel } from "./DeltaChannel.ts";
import { DDSFactoryRegistry } from "./TypeRegistry.ts";

export interface UnisonRuntimeOptions<T extends DDS>
{
  readonly entryPoint: T;
  readonly ddsTypes: readonly DDSFactoryOrClass[];
  readonly validate?: boolean;
}

export class UnisonRuntime<T extends DDS = DDS>
  extends EventEmitter<{
    localOp(dds: DDS, event: ILocalOpEvent): void;
  }>
  implements IObjectResolver
{
  public readonly entryPoint: T;

  public readonly history = new DocumentHistory(this);

  private readonly _channels = new Map<string, DeltaChannel>();

  private readonly _typeRegistry: DDSFactoryRegistry;

  private readonly _logger = unisonLogger.getSubLogger();

  public readonly encoder: UnisonEncoder;

  public constructor(options: UnisonRuntimeOptions<T>)
  {
    super();

    this.entryPoint = options.entryPoint;
    this._typeRegistry = new DDSFactoryRegistry(options.ddsTypes);

    this.encoder = new UnisonEncoder();
    this.encoder.onHandleEncode = dds => this._onHandleEncoded(dds);

    this._attachRecursive(options.entryPoint);

    if (options.validate !== false)
      this._validate();
  }

  public getObject(id: string): DDS | null
  {
    return this._channels.get(id)?.dds ?? null;
  }

  public getChannel(id: string): DeltaChannel | null
  {
    return this._channels.get(id) ?? null;
  }

  private _attachRecursive(dds: DDS): void
  {
    const encoder = new UnisonEncoder();
    const trackedObjects = new Set<DDS>();
    const remainingObjects: DDS[] = [dds];

    dds.id ??= crypto.randomUUID();

    encoder.onHandleEncode = (obj) =>
    {
      if (trackedObjects.has(obj))
        return;

      obj.id ??= crypto.randomUUID();

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

  private _attach(dds: DDS): boolean
  {
    if (this._channels.has(dds.id!))
      return false;

    dds.id ??= crypto.randomUUID();

    const channel = new DeltaChannel(this, dds);

    this._channels.set(dds.id, channel);

    dds.attach(this, channel);

    return true;
  }

  private _validate()
  {
    const missingFactories = new Set<string>();

    for (const entry of [...this._channels.values()])
    {
      const factory = this._typeRegistry.getFactory(entry.dds.attributes.type);

      if (!factory)
        missingFactories.add(entry.dds.attributes.type);
    }

    if (missingFactories.size > 0)
      throw new Error(`Could not find factory for types ${[...missingFactories].map(type => `"${type}"`).join(", ")}`);
  }

  public createSummary()
  {
    const encoder = new UnisonEncoder();
    const trackedObjects = new Set<DDS>();
    const remainingObjects: DDS[] = [this.entryPoint];

    encoder.onHandleEncode = (obj) =>
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

      summary.entries[current.id!] = {
        attributes: current.attributes,
        content: current.createSummary(encoder),
      };
    }

    return summary;
  }

  public opSubmitted(dds: DDS, event: ILocalOpEvent)
  {
    this.emit("localOp", dds, event);
  }

  private _onHandleEncoded(dds: DDS)
  {
    this.ensureAttached(dds);
  }

  public ensureAttached(dds: DDS)
  {
    if (!dds.isAttached)
      this._attach(dds);
  }
}
