import type { DDSClass, DDSPropertyOptions } from "./properties/DDSProperty";
import type { FloatPropertyOptions } from "./properties/FloatProperty";
import type { IntPropertyOptions } from "./properties/IntProperty";
import type { PropertyOptions } from "./properties/Property";
import { DDSProperty } from "./properties/DDSProperty";
import { FloatProperty } from "./properties/FloatProperty";
import { IntProperty } from "./properties/IntProperty";
import { Property } from "./properties/Property";
import "reflect-metadata";

const metadataKey = Symbol("SharedObject.metadata");

export function property<T>(options: PropertyOptions<T> = {}): PropertyDecorator
{
  return (target, propertyKey) =>
  {
    if (typeof propertyKey !== "string")
      throw new Error("Only string keys are supported");

    addProperty(target, new Property(propertyKey, options));
  };
}

property.int = function (options: IntPropertyOptions = {}): PropertyDecorator
{
  return (target, propertyKey) =>
  {
    if (typeof propertyKey !== "string")
      throw new Error("Only string keys are supported");

    addProperty(target, new IntProperty(propertyKey, options));
  };
};

property.float = function (options: FloatPropertyOptions = {}): PropertyDecorator
{
  return (target, propertyKey) =>
  {
    if (typeof propertyKey !== "string")
      throw new Error("Only string keys are supported");

    addProperty(target, new FloatProperty(propertyKey, options));
  };
};

property.dds = function (type: () => DDSClass, options: Omit<DDSPropertyOptions, "type"> = {}): PropertyDecorator
{
  return (target, propertyKey) =>
  {
    if (typeof propertyKey !== "string")
      throw new Error("Only string keys are supported");

    addProperty(target, new DDSProperty(propertyKey, { ...options, type }));
  };
};

export function addProperty(target: any, property: Property)
{
  const properties = [...getPropertyMetadata(target), property];

  Reflect.defineMetadata(metadataKey, properties, target);
}

export function getPropertyMetadata(target: any): readonly Property[]
{
  return Reflect.getMetadata(metadataKey, target) ?? [];
}
