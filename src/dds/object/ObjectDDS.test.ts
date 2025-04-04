import type { DDSAttributes } from "../DDSAttributes";
import { expect } from "vitest";
import { hydrateRuntime } from "../../runtime/hydrate";
import { UnisonRuntime } from "../../runtime/UnisonRuntime";
import { ValueType } from "../../serialization/types";
import { UnisonDecoder } from "../../serialization/UnisonDecoder";
import { encodeHandle, UnisonEncoder } from "../../serialization/UnisonEncoder";
import { property } from "./decorator";
import { ObjectDDS } from "./ObjectDDS";

describe("ObjectDDS", () =>
{
  it("creates summary", () =>
  {
    class Counter extends ObjectDDS
    {
      constructor()
      {
        super({ type: "counter" });
      }

      @property.int()
      value = 0;
    }

    const counter = new Counter();

    let summary = counter.createSummary(new UnisonEncoder());

    expect(summary).toEqual({
      value: 0,
    });

    counter.value = 2;

    summary = counter.createSummary(new UnisonEncoder());

    expect(summary).toEqual({
      value: 2,
    });
  });

  it("loads from summary", () =>
  {
    class Counter extends ObjectDDS
    {
      constructor()
      {
        super({ type: "counter" });
      }

      @property.int()
      value = 0;
    }

    const summary = {
      value: 2,
    };

    const counter = new Counter();

    counter.load(summary, new UnisonDecoder());

    expect(counter.value).toBe(2);
  });

  it("summarizes dds references", () =>
  {
    class Bar extends ObjectDDS
    {
      static readonly attributes: DDSAttributes = { type: "bar" };

      constructor()
      {
        super(Bar.attributes);
      }
    }

    class Foo extends ObjectDDS
    {
      static readonly attributes: DDSAttributes = { type: "foo" };

      constructor()
      {
        super(Foo.attributes);
      }

      @property.dds(() => Bar)
      bar = new Bar();
    }

    const runtime = new UnisonRuntime({
      entryPoint: new Foo(),
      ddsTypes: [Foo, Bar],
    });

    const foo = runtime.entryPoint;

    const summary = foo.createSummary(new UnisonEncoder());

    expect(summary).toEqual({
      bar: encodeHandle(foo.bar),
    });
  });

  it("summarizes recursive dds references", () =>
  {
    class Foo extends ObjectDDS
    {
      static readonly attributes: DDSAttributes = { type: "foo" };

      constructor()
      {
        super(Foo.attributes);
      }

      @property.dds(() => Foo)
      ref!: Foo;
    }

    const foo = new Foo();

    foo.ref = new Foo();

    foo.ref.ref = foo;

    const runtime = new UnisonRuntime({
      entryPoint: foo,
      ddsTypes: [Foo],
    });

    const summary = runtime.createSummary();

    expect(summary).toEqual({
      entryPoint: runtime.entryPoint.id,
      entries: {
        [foo.id!]: {
          attributes: Foo.attributes,
          content: {
            ref: encodeHandle(foo.ref),
          },
        },
        [foo.ref.id!]: {
          attributes: Foo.attributes,
          content: {
            ref: encodeHandle(foo),
          },
        },
      },
    });
  });

  it("loads with recursive dds references", () =>
  {
    class Foo extends ObjectDDS
    {
      static readonly attributes: DDSAttributes = { type: "foo" };

      constructor()
      {
        super(Foo.attributes);
      }

      @property.dds(() => Foo)
      ref!: Foo;
    }

    const summary = {
      entryPoint: "foo1",
      entries: {
        foo1: {
          attributes: Foo.attributes,
          content: {
            ref: [ValueType.Handle, "foo2"],
          },
        },
        foo2: {
          attributes: Foo.attributes,
          content: {
            ref: [ValueType.Handle, "foo1"],
          },
        },
      },
    };

    const runtime = hydrateRuntime(new Foo(), summary, [Foo]);

    const foo = runtime.entryPoint as Foo;

    expect(foo.id).toBe("foo1");
    expect(foo.ref.id).toBe("foo2");
    expect(foo.ref.ref.id).toBe("foo1");
  });
});
